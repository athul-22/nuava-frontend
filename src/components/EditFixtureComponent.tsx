import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useMutation } from '@apollo/client';
import { Toast } from 'primereact/toast';
import { gql } from '@apollo/client';

const EDIT_FIXTURE_MUTATION = gql`
  mutation EditFixture($input: EditFixtureInput!) {
    editFixture(input: $input) {
      status
      message
    }
  }
`;

interface EditFixtureDialogProps {
  isOpen: boolean;
  onClose: () => void;
  fixture: {
    id: string;
    fixtureStartTime: string;
    fixtureEndTime: string;
    fixtureLocation: string;
  };
}

const EditFixtureDialog: React.FC<EditFixtureDialogProps> = ({ isOpen, onClose, fixture}) => {
  const toast = useRef<Toast>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [location, setLocation] = useState("");

  const [editFixture] = useMutation(EDIT_FIXTURE_MUTATION);

  useEffect(() => {
    if (isOpen && fixture) {
      setStartTime(fixture.fixtureStartTime ? new Date(fixture.fixtureStartTime) : null);
      setEndTime(fixture.fixtureEndTime ? new Date(fixture.fixtureEndTime) : null);
      setLocation(fixture.fixtureLocation || "");
    }
  }, [isOpen, fixture]);

  const showToast = (severity: 'success' | 'error', summary: string, detail: string) => {
    if (toast.current) {
      toast.current.show({ severity, summary, detail, life: 3000 });
    }
  };

  const handleSave = () => {
    if (!startTime || !endTime) {
      console.error("Invalid date or time");
      showToast("error", "Error editing fixture", "Invalid date or time");
      return;
    }

    editFixture({
      variables: {
        input: {
          fixtureId: parseInt(fixture.id),
          fixtureStartTime: startTime.toISOString(),
          fixtureEndTime: endTime.toISOString(),
          fixtureLocation: location,
        },
      },
    })
      .then(() => {
        showToast("success", "Fixture edited", "Fixture has been successfully edited");
        onClose();
      })
      .catch((error) => {
        console.error("Error editing fixture:", error);
        showToast("error", "Error editing fixture", error.message);
      });
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="edit-fix-dialog">
      <DialogTitle>Edit Fixture</DialogTitle>
      <DialogContent style={{ width: "min-content" }}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <br />
          <TimePicker
            label="Start Time"
            value={startTime}
            onChange={(newValue) => setStartTime(newValue)}
          />
          <br />
          <br />
          <TimePicker
            label="End Time"
            value={endTime}
            onChange={(newValue) => setEndTime(newValue)}
          />
        </LocalizationProvider>
        <TextField
          label="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          margin="normal"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave}>Save</Button>
      </DialogActions>
      <Toast ref={toast} position="top-right" />
    </Dialog>
  );
};

export default EditFixtureDialog;