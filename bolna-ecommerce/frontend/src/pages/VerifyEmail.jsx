import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

const API_URL = "https://bolna-ai-app1.onrender.com";

export default function VerifyEmail() {
    const { token } = useParams();
    const [status, setStatus] = useState('loading'); // 'loading', 'success', 'error'
    const [message, setMessage] = useState('');

    useEffect(() => {
        const verifyToken = async () => {
            try {
                const { data } = await axios.post(`${API_URL}/api/auth/verify/${token}`);
                setStatus('success');
                setMessage(data.message);
            } catch (err) {
                setStatus('error');
                setMessage(err.response?.data?.message || 'Verification failed. The token may be invalid or expired.');
            }
        };

        if (token) {
            verifyToken();
        }
    }, [token]);

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-md text-center space-y-6">

                {status === 'loading' && (
                    <div className="flex flex-col items-center">
                        <Loader2 className="h-12 w-12 text-indigo-500 animate-spin mb-4" />
                        <h2 className="text-2xl font-bold text-gray-900">Verifying Email...</h2>
                        <p className="text-gray-500 mt-2">Please wait while we verify your account.</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="flex flex-col items-center">
                        <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
                        <h2 className="text-2xl font-bold text-gray-900">Verification Successful!</h2>
                        <p className="text-gray-600 mt-2">{message}</p>
                        <Link to="/login" className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none">
                            Proceed to Login
                        </Link>
                    </div>
                )}

                {status === 'error' && (
                    <div className="flex flex-col items-center">
                        <XCircle className="h-16 w-16 text-red-500 mb-4" />
                        <h2 className="text-2xl font-bold text-gray-900">Verification Failed</h2>
                        <p className="text-gray-600 mt-2">{message}</p>
                        <Link to="/signup" className="mt-6 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none">
                            Back to Sign Up
                        </Link>
                    </div>
                )}

            </div>
        </div>
    );
}
