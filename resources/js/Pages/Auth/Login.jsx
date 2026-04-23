import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import '../../../css/auth.css';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
            onSuccess: () => {
                // Welcome message on successful login
                setTimeout(() => {
                    if (window.alertify) {
                        alertify.success('Welcome back! Redirecting to dashboard...', 3);
                    }
                }, 500);
            },
        });
    };

    return (
        <div className="auth-container">
            <Head title="Log in" />

            {status && (
                <div className="status-message">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="auth-form">
                <div className="form-group">
                    <InputLabel htmlFor="email" value="Email" className="form-label" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="form-input"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                    />

                    <InputError message={errors.email} className="error-message" />
                </div>

                <div className="form-group">
                    <InputLabel htmlFor="password" value="Password" className="form-label" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="form-input"
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                    />

                    <InputError message={errors.password} className="error-message" />
                </div>

                <div className="form-group">
                    <label className="checkbox-label">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) =>
                                setData('remember', e.target.checked)
                            }
                        />
                        <span className="checkbox-text">
                            Remember me
                        </span>
                    </label>
                </div>

                <div className="form-actions">
                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="link"
                        >
                            Forgot your password?
                        </Link>
                    )}

                    <PrimaryButton className="btn-primary" disabled={processing}>
                        Log in
                    </PrimaryButton>
                </div>
                <div className="auth-divider">
                    <span>OR</span>
                </div>

                <div className="form-actions">
                    <a
                        href={route('google.redirect')}
                        className="google-button"
                    >
                        <svg className="google-icon" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Continue with Google
                    </a>
                </div>

                <a className="down-link" href="/register">Don't have an account? Sign up</a>
            </form>
        </div>
    );
}
