import React, { forwardRef } from 'react';
import MicButton from './MicButton';
import ClickNHold from 'react-click-n-hold';

const CNHWrapper = forwardRef((props, ref) => {
    return (
        <ClickNHold
            ref={ref}
            className={props.cnhClass}
            time={3}
            onStart={props.record}
            onClickNHold={props.stop}
            onEnd={props.stop} >
            <MicButton />
        </ClickNHold>
    );
});

export default CNHWrapper;