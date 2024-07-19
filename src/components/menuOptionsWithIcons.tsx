/* eslint-disable @typescript-eslint/no-unused-vars */
import { PencilIcon } from 'primereact/icons/pencil';
import { InfoCircleIcon } from 'primereact/icons/infocircle';
// import { ShareIcon } from 'primereact/icons/search';
import { SortAltIcon } from 'primereact/icons/sortalt';
import { CheckIcon } from 'primereact/icons/check';
import { TrashIcon } from 'primereact/icons/trash';
import styled from '@emotion/styled/types/base';

// Temporary functions
const handleEdit = () => {
  console.log('Edit clicked');
};

const handleInfo = () => {
  console.log('Info clicked');
};

const handleShare = () => {
  console.log('Share clicked');
};

const handleSwap = () => {
  console.log('Swap clicked');
};

const handleDelete = () => {
  console.log('Delete clicked');
};

const menuOptionsWithIcons = [
  { 
    label: 'Start', 
    icon: CheckIcon, 
    onClick: 'handleStart'
  },
  { 
    label: 'Edit', 
    icon: PencilIcon, 
    onClick: handleEdit
  },
  { 
    label: 'Swap Teams', 
    icon: SortAltIcon, 
    onClick: 'handleSwap'
  },
  { 
    label: 'Fixrure Info', 
    icon: InfoCircleIcon, 
    onClick: 'fixtureInfo'
  },
  { 
    label: 'Delete', 
    icon: TrashIcon, 
    style: { color: 'red' },
    onClick: handleDelete
    
  }
];

export default menuOptionsWithIcons;
