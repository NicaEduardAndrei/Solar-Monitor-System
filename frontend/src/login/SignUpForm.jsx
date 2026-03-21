export function SignUpForm({ setAuth }) {

    return (
        <div className="auth-form">

            <div className="titles-container-signup">
                <p className="title">Create your account</p>
                <p className="subtitle">Start monitoring your solar system</p>
            </div>

            <div className="form-container">
                <input placeholder="Username" />
                <input placeholder="Email address" />
                <input placeholder="Password" type="password" />
                <button>Sign up</button>
            </div>

            <div className="switch-auth">
                <p>Already have an account?</p>
                <span onClick={() => setAuth("login")}>Sign in</span>
            </div>

        </div>
    );
}