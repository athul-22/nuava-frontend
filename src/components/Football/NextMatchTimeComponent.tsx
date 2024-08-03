import React, { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { InputText } from 'primereact/inputtext';

interface MatchDialogProps {
    id: string;
    visible: boolean;
    onHide: () => void;
    onSubmit: (data: { id: string, date: Date, time: string }) => void;
}

const MatchDialog: React.FC<MatchDialogProps> = ({ id, visible, onHide, onSubmit }) => {
    const [date, setDate] = useState<Date | null>(null);
    const [time, setTime] = useState<string>('');

    const handleSubmit = () => {
        if (date && time) {
            onSubmit({ id, date, time });
            onHide();
        } else {
            // Handle validation error
            alert('Please fill in both date and time.');
        }
    };

    return (
        <Dialog header="Time for Next Match" visible={visible} style={{ width: '50vw' }} onHide={onHide}>
            <div className="p-fluid">
                <div className="p-field">
                    <label htmlFor="date">Date</label>
                    <Calendar id="date" value={date} onChange={(e) => setDate(e.value as Date)} showIcon />
                </div>
                <div className="p-field">
                    <label htmlFor="time">Time</label>
                    <InputText id="time" value={time} onChange={(e) => setTime(e.target.value)} />
                </div>
                <div className="p-field">
                    <Button label="Submit" icon="pi pi-check" onClick={handleSubmit} />
                </div>
            </div>
        </Dialog>
    );
};

export default MatchDialog;


// ⭕️ USEAGE EXAMPLE - NEXT MATCH TIME DIALOG - BRACKETS PAGE + LIVE FOOTBALL PAGE


// const App: React.FC = () => {
//     const [dialogVisible, setDialogVisible] = useState<boolean>(false);

//     const handleDialogSubmit = (data: { id: string, date: Date, time: string }) => {
//         console.log('Submitted Data:', data);
//     };

//         <div>
//             <Button label="Show Dialog" onClick={() => setDialogVisible(true)} />
//             <MatchDialog 
//                 id="default-id" 
//                 visible={dialogVisible} 
//                 onHide={() => setDialogVisible(false)} 
//                 onSubmit={handleDialogSubmit} 
//             />
//         </div>


// export default App;