import * as React from 'react';
import Button from '@mui/joy/Button';
import Stack from '@mui/joy/Stack';
import Modal from '@mui/joy/Modal';
import ModalClose from '@mui/joy/ModalClose';
import ModalDialog, { ModalDialogProps } from '@mui/joy/ModalDialog';
import DialogTitle from '@mui/joy/DialogTitle';
import DialogContent from '@mui/joy/DialogContent';
import TextField from '@mui/joy/TextField';
import Input from '@mui/joy/Input';

interface LayoutModalDialogProps {
  setModalOpen: (open: boolean) => void;
}

const LayoutModalDialog: React.FC<LayoutModalDialogProps> = ({ setModalOpen }) => {
  const [layout, setLayout] = React.useState<ModalDialogProps['layout'] | undefined>('center');
  const [email, setEmail] = React.useState("");

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = () => {
    // Handle forgot password logic
    setModalOpen(false);
  };

  return (
    <React.Fragment>
      <Modal open={!!layout} onClose={() => setModalOpen(false)}>
        <ModalDialog layout={layout}>
          <ModalClose />
          <DialogTitle>Forgot Your Password?</DialogTitle>
          <DialogContent>
            <div>
                <Input size="lg" placeholder="Large" />
              <Button onClick={handleSubmit} fullWidth style={{ marginTop: '20px' }}>
                Submit
              </Button>
            </div>
          </DialogContent>
        </ModalDialog>
      </Modal>
    </React.Fragment>
  );
};

export default LayoutModalDialog;
