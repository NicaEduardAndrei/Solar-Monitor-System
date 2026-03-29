import "./LinkDevicePage.css"

export function LinkDevicePage() {


    return (
        <>
            <div className="link-container">
                <div className="link-form">
                    <div className="titles-container-link">
                        <p className="title">Add your first device</p>
                        <p className="subtitle">Link a device to start viewing and managing your data</p>
                    </div>
                    <div className="form-container">
                        <input placeholder="Device ID" />
                        <input placeholder="Device password" type="password" />
                        <span className="error-message"></span>
                        <button>Link</button>
                    </div>
                </div>
            </div>
        </>
    )
}