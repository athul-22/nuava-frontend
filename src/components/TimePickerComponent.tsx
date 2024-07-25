import React, { useState, useRef } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { TextField, TextFieldProps } from '@mui/material';
import "../styles/Calender.css";

interface TimePickerComponentProps {
  value: any;
  onChange: (newValue: any) => void;
  sx?: any;
}

const TimePickerComponent: React.FC<TimePickerComponentProps> = ({ value, onChange, sx }) => {
  const [isOpen, setIsOpen] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <div ref={anchorRef}>
        <TimePicker
          open={isOpen}
          onClose={handleClose}
          value={value}
          onChange={(newValue) => {
            onChange(newValue);
            handleClose();
          }}
          sx={{ ...sx, }}
          slots={{
            textField: (params: TextFieldProps) => (
              <TextField
                {...params}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleOpen();
                }}
                sx={{ marginLeft: '15px'}}
              />
            ),
          }}
          slotProps={{
            popper: {
              anchorEl: anchorRef.current,
              placement: 'bottom-start',
              disablePortal: true,
            },
            inputAdornment: {
              onClick: (e) => {
                e.stopPropagation();
                toggleOpen();
              },
            },
          }}
        />
      </div>
    </LocalizationProvider>
  );
};

export default TimePickerComponent;
