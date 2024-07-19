import React, { useState, useRef } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { TextField } from '@mui/material';

const TimePickerComponent = ({ value, onChange, sx = {} }: { value: any, onChange: (newValue: any) => void, sx?: any }) => {
  const [isOpen, setIsOpen] = useState(false);
  const anchorRef = useRef(null);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <div ref={anchorRef} style={{ display: 'inline-block' }}>
        <TimePicker
          open={isOpen}
          onClose={handleClose}
          value={value}
          onChange={(newValue) => {
            onChange(newValue);
            handleClose();
          }}
          sx={{ ...sx, marginLeft: "15px" }}
          slots={{
            textField: (params) => (
              <TextField
                {...params}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleOpen();
                }}
              />
            ),
          }}
          slotProps={{
            popper: {
              anchorEl: anchorRef.current,
              placement: 'bottom-start',
              disablePortal: true
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