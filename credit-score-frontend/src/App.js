import React, { useState } from 'react';
import axios from 'axios';
import './index.css';

const API_BASE_URL = 'http://localhost:8080'; // API Gateway

function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setCurrentPage('login');
  };

  if (!token) {
    return <AuthPage setToken={setToken} setUser={setUser} setCurrentPage={setCurrentPage} />;
  }

  return (
    <div>
      <Navbar user={user} logout={logout} setCurrentPage={setCurrentPage} currentPage={currentPage} />
      <div className="container">
        {currentPage === 'dashboard' && <Dashboard user={user} />}
        {currentPage === 'calculate' && <CalculateScore user={user} />}
        {currentPage === 'chat' && <AiChat user={user} />}
      </div>
    </div>
  );
}

// ============================================
// NAVBAR COMPONENT
// ============================================
function Navbar({ user, logout, setCurrentPage, currentPage }) {
  return (
    <div className="navbar">
      <div className="navbar-content">
        <h1>🎯 Credit Score System</h1>
        <div className="navbar-links">
          <button
            onClick={() => setCurrentPage('dashboard')}
            style={{ color: currentPage === 'dashboard' ? '#667eea' : '#333' }}
          >
            📊 Dashboard
          </button>
          <button
            onClick={() => setCurrentPage('calculate')}
            style={{ color: currentPage === 'calculate' ? '#667eea' : '#333' }}
          >
            🧮 Calculate
          </button>
          <button
            onClick={() => setCurrentPage('chat')}
            style={{ color: currentPage === 'chat' ? '#667eea' : '#333' }}
          >
            🤖 AI Chat
          </button>
          <button onClick={logout} style={{ color: '#ef4444' }}>
            🚪 Logout ({user?.username || user?.email})
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// AUTH PAGE (LOGIN/REGISTER) - FIXED ✅
// ============================================
function AuthPage({ setToken, setUser, setCurrentPage }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    fullname: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // ✅ FIX 1: Changed endpoint to /api/users/login
      const endpoint = isLogin ? '/api/users/login' : '/api/users/register';

      // Prepare request body based on login or register
      const requestBody = isLogin
        ? { email: formData.email, password: formData.password }
        : {
            email: formData.email,
            username: formData.username,
            fullname: formData.fullname,
            password: formData.password
          };

      console.log('Sending request to:', `${API_BASE_URL}${endpoint}`);
      console.log('Request body:', requestBody);

      const response = await axios.post(`${API_BASE_URL}${endpoint}`, requestBody);

      if (isLogin) {
        // ✅ FIX 2: Store userId from response for auto-fill
        const userData = {
          email: formData.email,
          username: response.data.username || formData.email.split('@')[0],
          userId: response.data.userId || response.data.id // Store user ID
        };

        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(userData));
        setToken(response.data.token);
        setUser(userData);
        setCurrentPage('dashboard');
      } else {
        // Registration successful
        alert('✅ Registration successful! Please login with your email.');
        setIsLogin(true);
        setFormData({ email: '', username: '', fullname: '', password: '' });
      }
    } catch (err) {
      console.error('Auth error:', err);
      const errorMsg = err.response?.data?.message || err.message || 'Connection failed! Make sure backend is running.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: '80px' }}>
      <div className="auth-card" style={{ maxWidth: '500px', margin: '0 auto' }}>
        <div className="auth-header">
          <div className="floating-icon" style={{ fontSize: '48px', marginBottom: '16px' }}>
            {isLogin ? '🔐' : '📝'}
          </div>
          <h2>
            {isLogin ? 'Welcome Back!' : 'Create Account'}
          </h2>
          <p style={{ color: '#6b7280', marginTop: '8px' }}>
            {isLogin ? 'Login to continue your journey' : 'Join us and start your credit journey'}
          </p>
        </div>

        {error && <div className="error">❌ {error}</div>}

        <form onSubmit={handleSubmit}>
          {/* EMAIL FIELD - ALWAYS SHOWN */}
          <div className="input-group">
            <label>📧 Email Address</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="your-email@example.com"
              required
            />
          </div>

          {/* FULLNAME FIELD - ONLY FOR REGISTRATION */}
          {!isLogin && (
            <div className="input-group">
              <label>👤 Full Name</label>
              <input
                type="text"
                value={formData.fullname}
                onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
                placeholder="Enter your full name"
                required
              />
            </div>
          )}

          {/* USERNAME FIELD - ONLY FOR REGISTRATION */}
          {!isLogin && (
            <div className="input-group">
              <label>✨ Username</label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="Choose a unique username"
                required
              />
            </div>
          )}

          {/* PASSWORD FIELD - ALWAYS SHOWN */}
          <div className="input-group">
            <label>🔒 Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Enter your password"
              required
              minLength="6"
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', fontSize: '18px', padding: '16px' }} disabled={loading}>
            {loading ? '⏳ Processing...' : (isLogin ? '🚀 Login Now' : '✨ Create Account')}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '28px', color: '#6b7280', fontSize: '15px' }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span
            className="auth-toggle"
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
              setFormData({ email: '', username: '', fullname: '', password: '' });
            }}
          >
            {isLogin ? 'Register here' : 'Login here'}
          </span>
        </p>

        {/* Backend Connection Info */}
        <div className="info-box info-box-blue">
          <p style={{ margin: 0, fontWeight: '600' }}>
            💡 <strong>Backend URL:</strong> {API_BASE_URL}
          </p>
          <p style={{ margin: '8px 0 0 0', fontSize: '12px', opacity: 0.8 }}>
            Ensure all services are running (Docker, UserMS, CreditMS, Gateway)
          </p>
        </div>

        {/* Demo Info */}
        {isLogin && (
          <div className="info-box info-box-yellow">
            <p style={{ margin: 0, fontWeight: '600' }}>
              🔑 <strong>New here?</strong> Click "Register here" to create your account
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// ENHANCED DASHBOARD COMPONENT - SECURITY FIXED ✅
// ============================================
// ============================================
// SIMPLIFIED DASHBOARD COMPONENT - NO INPUT FIELD ✅
// ============================================
function Dashboard({ user }) {
  const [scoreData, setScoreData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Auto-use logged-in user's ID
  const userId = user?.userId || user?.id || '';

  const fetchScore = async () => {
    if (!userId) {
      setError('User ID not found. Please login again.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.get(`${API_BASE_URL}/api/credit/score/${userId}`);
      setScoreData(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Score not found. Please calculate your score first.');
      setScoreData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Welcome Card */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        marginBottom: '30px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div className="floating-icon" style={{ fontSize: '64px' }}>👋</div>
          <div>
            <h2 style={{ marginBottom: '8px', fontSize: '28px', fontWeight: '800' }}>
              Welcome Back!
            </h2>
            <p style={{ fontSize: '18px', opacity: 0.95, marginBottom: '8px' }}>
              Hey <strong>{user?.username || user?.email}</strong>!
            </p>
            <p style={{ fontSize: '16px', opacity: 0.9, margin: 0 }}>
              Your User ID: <strong style={{
                background: 'rgba(255,255,255,0.2)',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '18px'
              }}>{userId || 'Not Available'}</strong>
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div className="card" style={{
          background: 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)',
          border: '2px solid #667eea30',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>📊</div>
          <h3 style={{ color: '#667eea', marginBottom: '8px', fontSize: '18px' }}>Credit Score</h3>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>Check your current score</p>
        </div>

        <div className="card" style={{
          background: 'linear-gradient(135deg, #10b98115 0%, #05966915 100%)',
          border: '2px solid #10b98130',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>🎯</div>
          <h3 style={{ color: '#059669', marginBottom: '8px', fontSize: '18px' }}>Recommendations</h3>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>Get personalized advice</p>
        </div>

        <div className="card" style={{
          background: 'linear-gradient(135deg, #f59e0b15 0%, #d9730815 100%)',
          border: '2px solid #f59e0b30',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>🤖</div>
          <h3 style={{ color: '#d97308', marginBottom: '8px', fontSize: '18px' }}>AI Assistant</h3>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>24/7 financial advisor</p>
        </div>
      </div>

      {/* Score Checker Card - SIMPLIFIED ✅ */}
      <div className="card" style={{
        background: 'white',
        boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
        textAlign: 'center'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginBottom: '30px',
          gap: '16px'
        }}>
          <div style={{
            fontSize: '64px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            🔍
          </div>
          <div>
            <h3 style={{
              fontSize: '28px',
              fontWeight: '800',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              marginBottom: '8px'
            }}>
              Your Credit Score
            </h3>
            <p style={{ color: '#6b7280', fontSize: '15px', marginBottom: '16px' }}>
              Click below to view your current credit score
            </p>
            <div style={{
              display: 'inline-block',
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
              borderRadius: '12px',
              border: '2px solid #d1d5db'
            }}>
              <p style={{ margin: 0, color: '#4b5563', fontSize: '14px', fontWeight: '600' }}>
                Your ID: <span style={{
                  color: '#667eea',
                  fontSize: '18px',
                  fontWeight: '700'
                }}>{userId || 'N/A'}</span>
              </p>
            </div>
          </div>
        </div>

        {error && <div className="error" style={{ marginBottom: '20px' }}>❌ {error}</div>}

        <button
          onClick={fetchScore}
          className="btn btn-primary"
          disabled={loading || !userId}
          style={{
            padding: '18px 48px',
            fontSize: '18px',
            fontWeight: '700',
            minWidth: '300px'
          }}
        >
          {loading ? '🔄 Loading...' : '🔍 Get Your Credit Score'}
        </button>

        {!userId && (
          <p style={{
            marginTop: '16px',
            color: '#ef4444',
            fontSize: '14px',
            fontWeight: '600'
          }}>
            ⚠️ User ID not found. Please logout and login again.
          </p>
        )}

        {/* Score Display Section */}
        {scoreData && (
          <div style={{
            marginTop: '40px',
            padding: '40px',
            background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)',
            borderRadius: '24px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <div style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#6b7280',
                textTransform: 'uppercase',
                letterSpacing: '2px',
                marginBottom: '16px'
              }}>
                Your Credit Score
              </div>
              <div className="score-display" style={{
                fontSize: '80px',
                fontWeight: '900',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                marginBottom: '20px',
                lineHeight: '1'
              }}>
                {scoreData.score}
              </div>
              <div style={{ marginBottom: '16px' }}>
                <span className={`score-badge score-${scoreData.riskCategory.toLowerCase()}`} style={{
                  fontSize: '16px',
                  padding: '12px 28px',
                  borderRadius: '30px',
                  fontWeight: '700'
                }}>
                  {scoreData.riskCategory} RISK
                </span>
              </div>
              <p style={{
                fontSize: '16px',
                color: '#6b7280',
                fontWeight: '500'
              }}>
                {scoreData.scoreRange}
              </p>
            </div>

            {/* Recommendations Section */}
            <div style={{
              marginTop: '32px',
              padding: '28px',
              background: 'white',
              borderRadius: '16px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '20px'
              }}>
                <div style={{ fontSize: '28px' }}>📋</div>
                <h4 style={{
                  color: '#667eea',
                  fontSize: '20px',
                  fontWeight: '700',
                  margin: 0
                }}>
                  Personalized Recommendations
                </h4>
              </div>
              <ul style={{
                marginTop: '16px',
                paddingLeft: '0',
                listStyle: 'none'
              }}>
                {scoreData.recommendations.map((rec, idx) => (
                  <li key={idx} style={{
                    marginBottom: '16px',
                    color: '#4b5563',
                    fontSize: '15px',
                    padding: '12px 16px',
                    background: '#f9fafb',
                    borderRadius: '10px',
                    borderLeft: '4px solid #667eea',
                    lineHeight: '1.6'
                  }}>
                    <span style={{ fontWeight: '600', color: '#667eea' }}>✓</span> {rec}
                  </li>
                ))}
              </ul>
            </div>

            {/* Points to Next Level */}
            <div style={{
              marginTop: '24px',
              padding: '20px',
              background: 'linear-gradient(135deg, rgba(102,126,234,0.1) 0%, rgba(118,75,162,0.1) 100%)',
              borderRadius: '12px',
              textAlign: 'center',
              border: '2px dashed #667eea50'
            }}>
              <p style={{
                margin: 0,
                fontSize: '15px',
                color: '#667eea',
                fontWeight: '600'
              }}>
                ⭐ <strong style={{ fontSize: '18px' }}>{scoreData.pointsToNextLevel}</strong> points to next level!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
// ============================================
// ENHANCED CALCULATE SCORE COMPONENT
// ============================================
function CalculateScore({ user }) {
  // ✅ Auto-fill userId
  const [formData, setFormData] = useState({
    userId: user?.userId || '',
    monthlyIncome: '',
    existingLoans: '',
    paymentHistory: 'GOOD',
    creditUtilization: ''
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API_BASE_URL}/api/credit/calculate`, {
        ...formData,
        userId: parseInt(formData.userId),
        monthlyIncome: parseFloat(formData.monthlyIncome),
        existingLoans: parseFloat(formData.existingLoans),
        creditUtilization: parseInt(formData.creditUtilization)
      });

      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to calculate score');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{
      background: 'white',
      boxShadow: '0 20px 60px rgba(0,0,0,0.15)'
    }}>
      {/* Header Section */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: '32px',
        gap: '16px'
      }}>
        <div style={{
          fontSize: '56px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          🧮
        </div>
        <div>
          <h2 style={{
            fontSize: '28px',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '6px'
          }}>
            Calculate Credit Score
          </h2>
          <p style={{ color: '#6b7280', fontSize: '15px', margin: 0 }}>
            Fill in your financial details to get instant score calculation
          </p>
        </div>
      </div>

      {/* Info Banner */}
      <div style={{
        padding: '16px 20px',
        background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
        borderRadius: '12px',
        marginBottom: '30px',
        border: '1px solid #bfdbfe',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <div style={{ fontSize: '24px' }}>💡</div>
        <p style={{ margin: 0, color: '#1e40af', fontSize: '14px', lineHeight: '1.6' }}>
          <strong>Tip:</strong> Provide accurate information for the most precise credit score calculation
        </p>
      </div>

      {error && <div className="error">❌ {error}</div>}
      {result && <div className="success">✅ Score calculated successfully!</div>}

      {/* Form Section */}
      <form onSubmit={handleSubmit}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
          marginBottom: '24px'
        }}>
          <div className="input-group">
            <label>🆔 User ID (Auto-filled)</label>
            <input
              type="number"
              value={formData.userId}
              onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
              placeholder="Your User ID"
              required
              readOnly
              style={{ background: '#f9fafb' }}
            />
          </div>

          <div className="input-group">
            <label>💰 Monthly Income (₹)</label>
            <input
              type="number"
              value={formData.monthlyIncome}
              onChange={(e) => setFormData({ ...formData, monthlyIncome: e.target.value })}
              placeholder="e.g., 50000"
              required
            />
          </div>

          <div className="input-group">
            <label>🏦 Existing Loans (₹)</label>
            <input
              type="number"
              value={formData.existingLoans}
              onChange={(e) => setFormData({ ...formData, existingLoans: e.target.value })}
              placeholder="e.g., 200000"
              required
            />
          </div>

          <div className="input-group">
            <label>📊 Credit Utilization (%)</label>
            <input
              type="number"
              value={formData.creditUtilization}
              onChange={(e) => setFormData({ ...formData, creditUtilization: e.target.value })}
              placeholder="e.g., 30"
              required
              min="0"
              max="100"
            />
          </div>

          <div className="input-group">
            <label>📝 Payment History</label>
            <select
              value={formData.paymentHistory}
              onChange={(e) => setFormData({ ...formData, paymentHistory: e.target.value })}
              style={{
                appearance: 'none',
                backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 12 12\'%3E%3Cpath fill=\'%23667eea\' d=\'M6 9L1 4h10z\'/%3E%3C/svg%3E")',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 16px center',
                paddingRight: '40px'
              }}
            >
              <option value="EXCELLENT">⭐ Excellent</option>
              <option value="GOOD">✅ Good</option>
              <option value="FAIR">⚠️ Fair</option>
              <option value="POOR">❌ Poor</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
          style={{
            width: '100%',
            padding: '18px',
            fontSize: '18px',
            fontWeight: '700',
            marginTop: '8px'
          }}
        >
          {loading ? '🔄 Calculating Your Score...' : '🧮 Calculate Credit Score'}
        </button>
      </form>

      {/* Result Section */}
      {result && (
        <div style={{
          marginTop: '40px',
          padding: '40px',
          background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)',
          borderRadius: '24px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
          border: '1px solid #e5e7eb',
          animation: 'slideUp 0.5s ease-out'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div className="floating-icon" style={{ fontSize: '64px', marginBottom: '16px' }}>
              🎉
            </div>
            <h3 style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#374151',
              marginBottom: '24px'
            }}>
              Your Calculated Credit Score
            </h3>
            <div className="score-display" style={{
              fontSize: '80px',
              fontWeight: '900',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              marginBottom: '20px'
            }}>
              {result.score}
            </div>
            <div style={{ marginBottom: '16px' }}>
              <span className={`score-badge score-${result.riskCategory.toLowerCase()}`} style={{
                fontSize: '16px',
                padding: '12px 28px'
              }}>
                {result.riskCategory} RISK
              </span>
            </div>
            <p style={{
              fontSize: '16px',
              color: '#6b7280',
              fontWeight: '500'
            }}>
              {result.scoreRange}
            </p>
          </div>

          {/* Recommendations */}
          <div style={{
            marginTop: '32px',
            padding: '28px',
            background: 'white',
            borderRadius: '16px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '20px'
            }}>
              <div style={{ fontSize: '28px' }}>💡</div>
              <h4 style={{
                color: '#667eea',
                fontSize: '20px',
                fontWeight: '700',
                margin: 0
              }}>
                Expert Recommendations
              </h4>
            </div>
            <ul style={{
              marginTop: '16px',
              paddingLeft: '0',
              listStyle: 'none'
            }}>
              {result.recommendations.map((rec, idx) => (
                <li key={idx} style={{
                  marginBottom: '14px',
                  color: '#4b5563',
                  fontSize: '15px',
                  padding: '12px 16px',
                  background: '#f9fafb',
                  borderRadius: '10px',
                  borderLeft: '4px solid #667eea',
                  lineHeight: '1.6'
                }}>
                  <span style={{ fontWeight: '600', color: '#667eea' }}>→</span> {rec}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================
// ENHANCED AI CHAT COMPONENT
// ============================================
function AiChat({ user }) {
  const [messages, setMessages] = useState([
    { type: 'ai', text: 'Hello! I\'m your AI credit score advisor. 👋\n\nI can help you with:\n• Credit score improvement strategies\n• Loan eligibility analysis\n• Financial planning advice\n• Credit card recommendations\n\nWhat would you like to know?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [userId] = useState(user?.userId || 100);
  const [currentScore] = useState(650);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { type: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/ai/chat`, {
        message: input,
        userId: userId,
        currentScore: currentScore
      });

      const aiMessage = { type: 'ai', text: response.data.response };
      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      const errorMessage = { type: 'ai', text: '❌ Sorry, I encountered an error. Please try again or rephrase your question.' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const quickQuestions = [
    "How to improve my credit score?",
    "Am I eligible for a home loan?",
    "Best credit cards for my score?",
    "What affects my credit score?"
  ];

  return (
    <div className="card" style={{
      background: 'white',
      boxShadow: '0 20px 60px rgba(0,0,0,0.15)'
    }}>
      {/* Header Section */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: '28px',
        gap: '16px',
        padding: '20px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '16px',
        color: 'white'
      }}>
        <div className="floating-icon" style={{ fontSize: '56px' }}>
          🤖
        </div>
        <div>
          <h2 style={{
            fontSize: '28px',
            fontWeight: '800',
            marginBottom: '6px',
            color: 'white'
          }}>
            AI Financial Advisor
          </h2>
          <p style={{ fontSize: '15px', margin: 0, opacity: 0.95 }}>
            24/7 intelligent assistant powered by AI
          </p>
        </div>
      </div>

      {/* Chat Container */}
      <div className="chat-container" style={{
        height: '500px',
        overflowY: 'auto',
        padding: '24px',
        background: 'linear-gradient(to bottom, #f9fafb 0%, #f3f4f6 100%)',
        borderRadius: '16px',
        marginBottom: '24px',
        boxShadow: 'inset 0 2px 8px rgba(0, 0, 0, 0.08)',
        border: '1px solid #e5e7eb'
      }}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`chat-message ${msg.type}`}
            style={{
              marginBottom: '18px',
              padding: '16px 20px',
              borderRadius: msg.type === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
              maxWidth: '85%',
              animation: 'messageAppear 0.4s ease-out',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              ...(msg.type === 'user' ? {
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                marginLeft: 'auto'
              } : {
                background: 'white',
                color: '#1f2937',
                border: '2px solid #e5e7eb'
              })
            }}
          >
            <div style={{
              whiteSpace: 'pre-wrap',
              lineHeight: '1.6',
              fontSize: '15px'
            }}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{
            textAlign: 'center',
            padding: '20px',
            color: '#667eea',
            fontSize: '16px',
            fontWeight: '600'
          }}>
            <div className="floating-icon" style={{ fontSize: '32px', marginBottom: '8px' }}>
              🤔
            </div>
            AI is thinking...
          </div>
        )}
      </div>

      {/* Quick Questions */}
      <div style={{ marginBottom: '20px' }}>
        <p style={{
          fontSize: '13px',
          fontWeight: '600',
          color: '#6b7280',
          marginBottom: '12px',
          textTransform: 'uppercase',
          letterSpacing: '1px'
        }}>
          Quick Questions:
        </p>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          {quickQuestions.map((question, idx) => (
            <button
              key={idx}
              onClick={() => {
                setInput(question);
              }}
              style={{
                padding: '10px 16px',
                background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
                border: '2px solid #d1d5db',
                borderRadius: '20px',
                fontSize: '13px',
                color: '#4b5563',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontWeight: '500'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                e.target.style.color = 'white';
                e.target.style.borderColor = '#667eea';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)';
                e.target.style.color = '#4b5563';
                e.target.style.borderColor = '#d1d5db';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              {question}
            </button>
          ))}
        </div>
      </div>

      {/* Input Section */}
      <div style={{
        display: 'flex',
        gap: '12px',
        padding: '16px',
        background: '#f9fafb',
        borderRadius: '16px',
        border: '2px solid #e5e7eb'
      }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && !loading && sendMessage()}
          placeholder="Type your question here..."
          disabled={loading}
          style={{
            flex: 1,
            padding: '14px 18px',
            border: '2px solid #e5e7eb',
            borderRadius: '12px',
            fontSize: '15px',
            background: 'white',
            transition: 'all 0.3s ease'
          }}
        />
        <button
          onClick={sendMessage}
          className="btn btn-primary"
          disabled={loading || !input.trim()}
          style={{
            padding: '14px 24px',
            fontSize: '16px',
            minWidth: '120px'
          }}
        >
          {loading ? '⏳' : '📤 Send'}
        </button>
      </div>

      {/* Info Banner */}
      <div style={{
        marginTop: '20px',
        padding: '16px 20px',
        background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
        borderRadius: '12px',
        border: '1px solid #bfdbfe',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px'
      }}>
        <div style={{ fontSize: '20px', marginTop: '2px' }}>💡</div>
        <div>
          <p style={{ margin: 0, color: '#1e40af', fontSize: '14px', lineHeight: '1.6', fontWeight: '500' }}>
            <strong>Pro Tip:</strong> Be specific with your questions for better advice. Include details like your current score, income, or financial goals.
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
