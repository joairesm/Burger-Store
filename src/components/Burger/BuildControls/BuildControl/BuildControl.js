import React from 'react';
import './BuildControl.css';

const buildControl = (props) => (

    <div className="BuildControl">
        <div className="Label">{props.label}</div>
        <button disabled={props.disabled} onClick={props.removed} className="Less">Less</button>
        <button onClick={props.added} className="More">More</button>
    </div>
);

export default buildControl;