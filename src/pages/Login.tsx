import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState('');
  const [adminLoading, setAdminLoading] = useState(false);

  useEffect(() => {
    localStorage.removeItem('currentProjectId');
    
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/dashboard');
      }
    };
    checkSession();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('请输入邮箱和密码');
      setLoading(false);
      return;
    }

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
        setLoading(false);
        return;
      }

      if (data.user) {
        const { data: projects, error: fetchError } = await supabase
          .from('projects')
          .select('*')
          .eq('user_email', data.user.email)
          .order('created_at', { ascending: false })
          .limit(1);

        if (fetchError) {
          console.error('Fetch projects error:', fetchError);
        }

        if (projects && projects.length > 0) {
          const projectId = projects[0].id;
          localStorage.setItem('currentProjectId', projectId.toString());
          navigate('/dashboard');
        } else {
          navigate('/project/apply');
        }
      }
    } catch (err) {
      setError('登录失败，请稍后重试');
    }

    setLoading(false);
  };

  const handleAdminLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError('');
    setAdminLoading(true);

    if (!adminEmail || !adminPassword) {
      setAdminError('请输入运营账号和密码');
      setAdminLoading(false);
      return;
    }
    
    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: adminEmail,
        password: adminPassword,
      });

      if (signInError) {
        setAdminError('账号或密码错误');
        setAdminLoading(false);
        return;
      }

      if (data.user) {
        localStorage.setItem('isAdmin', 'true');
        navigate('/admin/upload');
      }
    } catch (err) {
      setAdminError('登录失败，请稍后重试');
    }
    
    setAdminLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-red-50 to-orange-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-red-500 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">欢迎回来</h1>
          <p className="text-gray-500 mt-2">登录小红书 GEO 监控平台</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">邮箱</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition"
              placeholder="请输入邮箱地址"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">密码</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition"
              placeholder="请输入密码"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-pink-500 to-red-500 text-white py-3 rounded-lg font-medium hover:from-pink-600 hover:to-red-600 transition disabled:opacity-50"
          >
            {loading ? '登录中...' : '登录'}
          </button>
        </form>

        <div className="text-center mt-4">
          <span className="text-gray-500 text-sm">没有账号？</span>
          <a href="/register" className="text-pink-500 text-sm font-medium hover:underline ml-1">立即注册</a>
        </div>

        <div className="mt-6 text-center">
          <a href="/" className="text-gray-500 text-sm hover:text-pink-500">返回首页</a>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          {showAdminLogin ? (
            <form onSubmit={handleAdminLoginSubmit}>
              <p className="text-center text-gray-500 text-xs mb-4">运营管理登录</p>
              <div className="mb-3">
                <input
                  type="text"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none text-sm"
                  placeholder="运营账号"
                />
              </div>
              <div className="mb-3">
                <input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none text-sm"
                  placeholder="运营密码"
                />
              </div>
              {adminError && (
                <p className="text-red-500 text-xs mb-3 text-center">{adminError}</p>
              )}
              <button
                type="submit"
                disabled={adminLoading}
                className="w-full bg-gray-800 text-white py-2 rounded-lg text-sm hover:bg-gray-900 transition disabled:opacity-50"
              >
                {adminLoading ? '登录中...' : '登录'}
              </button>
              <button
                type="button"
                onClick={() => { setShowAdminLogin(false); setAdminError(''); }}
                className="w-full mt-2 text-gray-500 text-xs hover:text-gray-700"
              >
                取消
              </button>
            </form>
          ) : (
            <>
              <p className="text-center text-gray-400 text-xs mb-4">运营管理入口</p>
              <button
                onClick={() => setShowAdminLogin(true)}
                className="w-full bg-gray-800 text-white py-2 rounded-lg text-sm hover:bg-gray-900 transition"
              >
                运营账号登录
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
