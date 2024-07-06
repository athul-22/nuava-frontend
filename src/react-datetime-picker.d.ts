declare module 'react-datetime-picker' {
    import { ComponentType } from 'react';
  
    export interface DateTimePickerProps {
      onChange: (date: Date | null) => void;
      value: Date | null;
      format?: string;
      className?: string;
      disabled?: boolean;
      // Add any other props you're using
    }
  
    const DateTimePicker: ComponentType<DateTimePickerProps>;
  
    export default DateTimePicker;
  }