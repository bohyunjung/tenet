import React, { forwardRef } from 'react';
import IconButton from '@material-ui/core/IconButton';
import MicIcon from '@material-ui/icons/Mic';

const MicButton = forwardRef((props, ref) => {
    return (
        <IconButton
            disableFocusRipple={true}
            disableRipple={true}
            style={{ 
                backgroundColor: 'transparent',
                height: '100vh'
            }}
        >
            <MicIcon
                style={{ fontSize: 200 }}
            />
        </IconButton>
    )
});

export default MicButton;