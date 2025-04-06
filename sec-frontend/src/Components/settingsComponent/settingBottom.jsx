import React from 'react'
import './settingBottom.css'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

function SettingBottomBox(props) {
    return (
        <div className="setting-bottom-box">
            <div className="leftflex">
                <div className="bottom-img">
                    <img src={props.settingBottomImage} alt="" />
                </div>
                <div className='bottom-box-name'>{props.bottomBoxName}</div>
            </div>

<div className="bottom-goto" onClick={props.onClick}>
  <span>{props.bottomGoto}</span>
  <KeyboardArrowRightIcon sx={{color: "#80849c"}} />
</div>
        </div>
    )
}

export default SettingBottomBox