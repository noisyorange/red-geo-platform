import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'admin' | 'customer'>('customer');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (role === 'admin') {
      if (username === 'admin' && password === '1234554321') {
        navigate('/admin/upload');
      } else {
        setError('运营账号或密码错误');
      }
    } else {
      if (username && password) {
        const savedProjects = localStorage.getItem('projects');
        if (savedProjects) {
          const projects = JSON.parse(savedProjects);
          const hasProject = projects.length > 0;
          if (hasProject) {
            navigate('/dashboard');
          } else {
            navigate('/project/apply');
          }
        } else {
          navigate('/project/apply');
        }
      } else {
        setError('请输入用户名和密码');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-red-50 to-orange-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-red-500 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">小红书 GEO 监控</h1>
          <p className="text-gray-500 mt-2">服务监控管理平台</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">角色选择</label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setRole('admin')}
                className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all ${
                  role === 'admin'
                    ? 'border-pink-500 bg-pink-50 text-pink-700'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                运营
              </button>
              <button
                type="button"
                onClick={() => setRole('customer')}
                className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all ${
                  role === 'customer'
                    ? 'border-pink-500 bg-pink-50 text-pink-700'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                客户
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">用户名</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all"
              placeholder="请输入用户名"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">密码</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all"
              placeholder="请输入密码"
              required
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          <button
            type="submit"
            className="w-full py-3 px-4 bg-gradient-to-r from-pink-500 to-red-500 text-white font-medium rounded-lg hover:from-pink-600 hover:to-red-600 transition-all shadow-lg hover:shadow-xl"
          >
            登录
          </button>
        </form>

        <div className="mt-6 text-center">
          <span className="text-gray-500">还没有账号？</span>
          <button
            onClick={() => navigate('/register')}
            className="ml-1 text-pink-500 hover:text-pink-600 font-medium"
          >
            立即注册
          </button>
        </div>
      </div>
    </div>
  );
}
