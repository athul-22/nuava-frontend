declare module 'date-fns' {
    export function format(date: Date | number, format: string, options?: Object): string;
    export function parse(dateString: string, formatString: string, backupDate: Date, options?: Object): Date;
    export function set(date: Date | number, values: Object): Date;
    
    // Add other date-fns functions you're using or might use in the future
    export function addDays(date: Date | number, amount: number): Date;
    export function subDays(date: Date | number, amount: number): Date;
    export function isValid(date: any): boolean;
    // ... add more as needed
  }