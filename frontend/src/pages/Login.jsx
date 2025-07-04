import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { User, Lock } from 'lucide-react';
import axios from 'axios'
import { toast } from 'react-toastify'
export default function Login() {
  const [authMode, setAuthMode] = useState('login');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    dob: '',
    gender: '',
    address: { line1: '', line2: '' }
  });

  const navigate = useNavigate();
  const { token, setToken, backendUrl } = useContext(AppContext);
 

 
  useEffect(() => {
    if (token) navigate('/');
  }, [token, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (authMode === 'signup') {

      const { data } = await axios.post(backendUrl + '/api/user/register', { formData })

      if (data.success) {
        localStorage.setItem('token', data.token)
        setToken(data.token)
      } else {
        toast.error(data.message)
      }

    } else {

      const { data } = await axios.post(backendUrl + '/api/user/login', { email: formData.email, password: formData.password })

      if (data.success) {
        localStorage.setItem('token', data.token)
        setToken(data.token)
      } else {
        toast.error(data.message)
      }

    }
    
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-teal-100 overflow-hidden">
        {/* Card Header Bar */}
        <div className="bg-[#0d948833] py-7 px-10 text-center">
          <h2 className="text-3xl font-bold text-primary tracking-tight">
            {authMode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>
        </div>
        <div className="p-10 sm:p-12">
          {/* Toggle */}
          <div className="flex justify-center mb-10">
            <div className="bg-gray-100 rounded-full flex gap-2 p-1">
              {['login', 'signup'].map(mode => (
                <button
                  key={mode}
                  onClick={() => setAuthMode(mode)}
                  className={`px-8 py-2 text-base font-semibold rounded-full transition-all duration-200 focus:outline-none 
                    ${authMode === mode ? 'bg-primary text-white shadow' : 'text-primary hover:bg-primary/10'}`}
                >
                  {mode === 'login' ? 'Sign In' : 'Sign Up'}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {authMode === 'signup' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-600">Full Name</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                      />
                      <User className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-600">Phone</label>
                    <input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="(123) 456-7890"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="dob" className="block text-sm font-medium text-gray-600">Date of Birth</label>
                    <input
                      id="dob"
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                    />
                  </div>

                  <div>
                    <label htmlFor="gender" className="block text-sm font-medium text-gray-600">Gender</label>
                    <select
                      id="gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                    >
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="line1" className="block text-sm font-medium text-gray-600">Address Line 1</label>
                  <input
                    id="line1"
                    name="address.line1"
                    value={formData.address.line1}
                    onChange={handleInputChange}
                    placeholder="Street address"
                    required
                    className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="line2" className="block text-sm font-medium text-gray-600">Address Line 2 <span className="text-xs text-gray-400">(Optional)</span></label>
                  <input
                    id="line2"
                    name="address.line2"
                    value={formData.address.line2}
                    onChange={handleInputChange}
                    placeholder="Apt, Unit, etc."
                    className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  />
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-600">Email address</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="name@example.com"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-600">Password</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    id="password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  />
                  <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 font-semibold rounded-lg bg-primary hover:bg-teal-600 text-white tracking-wide shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 text-lg mt-2"
            >
              {authMode === 'signup' ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-500">
            {authMode === 'signup' ? 'Already have an account?' : "Don't have an account?"}
            <button
              onClick={() => setAuthMode(authMode === 'signup' ? 'login' : 'signup')}
              className="text-indigo-600 font-medium hover:underline ml-1"
            >
              {authMode === 'signup' ? 'Sign In' : 'Register'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
