import React from 'react';
import { Modal } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SaveChapterImg from '../../../../assets/images/saveChapter.svg'; // Optional default image
import {
    CircleButtonFilled,
    ClsoeModalBtn,
    CustomModalBody,
    CustomModalHeader,
    ModalBodyContent,
    ModalBox,
    ModalDark,
    ModalFooter,
    ModalImg,
    MoldalLightBtn,
} from './ModalStyle';
import { Paragraph } from '../Typography/Typography';

interface ModalPopupProps {
    open: boolean;
    onClose: () => void;
    onCancel: () => void;
    onConfirm: () => void;
    type?: 'delete' | 'save';
    title?: string;
    name?: string;
    image?: string;
    cancelText?: string;
    confirmText?: string;
}

const ModalPopup: React.FC<ModalPopupProps> = ({
    open,
    onClose,
    onCancel,
    onConfirm,
    type = 'delete',
    title = '',
    name = '',
    image = SaveChapterImg,
    cancelText,
    confirmText,
}) => {
    const isDelete = type === 'delete';

    return (
        <Modal open={open} onClose={onClose}>
            <ModalBox>
                {/* Modal Header */}
                <CustomModalHeader>
                    <ClsoeModalBtn>
                        <CircleButtonFilled onClick={onClose}>
                            <CloseIcon />
                        </CircleButtonFilled>
                    </ClsoeModalBtn>
                </CustomModalHeader>

                {/* Modal Body */}
                <CustomModalBody>
                    <ModalImg>
                        <img src={image} alt={isDelete ? 'Delete' : 'Confirm'} />
                    </ModalImg>
                    <ModalBodyContent>
                        <Paragraph>
                            {isDelete
                                ? `Are you sure you want to delete this ${title} "${name}"?`
                                : `Are you sure you want to proceed with this ${title}?`}
                        </Paragraph>
                    </ModalBodyContent>
                </CustomModalBody>

                {/* Modal Footer */}
                <ModalFooter>
                    <MoldalLightBtn variant="contained" onClick={onCancel}>
                        {cancelText || (isDelete ? 'Cancel' : 'No')}
                    </MoldalLightBtn>
                    <ModalDark variant="outlined" onClick={onConfirm}>
                        {confirmText || (isDelete ? 'Delete' : 'Yes')}
                    </ModalDark>
                </ModalFooter>
            </ModalBox>
        </Modal>
    );
};

export default ModalPopup;
