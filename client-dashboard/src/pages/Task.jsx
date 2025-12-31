import React, { useState, useEffect } from 'react';
import { FaUsers, FaCopy, FaSearch, FaFilter, FaSort, FaGem, FaBuilding, FaRocket, FaEdit } from 'react-icons/fa';
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/md';
import { supabase } from '../supabaseClient';
import './Task.css';

const Task = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('All Task');
    const [expandedTaskId, setExpandedTaskId] = useState(null);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const { data, error } = await supabase.functions.invoke('dashboard-api', {
                    body: { action: 'get-tasks' }
                });
                if (error) throw error;
                setTasks(data || []);
            } catch (err) {
                console.error("Error fetching tasks:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, []);

    const toggleExpand = (id) => {
        setExpandedTaskId(expandedTaskId === id ? null : id);
    };

    const getIcon = (type) => {
        switch (type) {
            case 'group': return <FaUsers />;
            case 'rocket': return <FaRocket />;
            case 'feedback': return <FaEdit />;
            case 'building': return <FaBuilding />;
            default: return <FaUsers />;
        }
    };

    if (loading) return <div className="loading">Loading Tasks...</div>;

    return (
        <div className="task-page">
            <div className="task-search-container">
                <FaSearch className="search-icon" />
                <input type="text" placeholder="Search tasks" className="task-search-input" />
            </div>

            <div className="task-header-controls">
                <div className="task-tabs">
                    {['All Task', 'Completed', 'Ongoing'].map(tab => (
                        <button
                            key={tab}
                            className={`task-tab ${activeTab === tab ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
                <div className="task-actions">
                    <button className="action-btn">Filter <FaFilter style={{ marginLeft: 8 }} /></button>
                    <button className="action-btn">Sort <FaSort style={{ marginLeft: 8 }} /></button>
                </div>
            </div>

            <div className="task-list">
                {tasks.map((task) => (
                    <div className="task-card" key={task.id}>
                        <div className="task-card-header">
                            <div className="task-left">
                                <div className={`task-icon-wrapper icon-red-gradient`}>
                                    {getIcon(task.icon_type)}
                                </div>
                                <div className="task-info">
                                    <h3>{task.title}</h3>
                                    <div className="task-meta">
                                        <span>{task.category}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="task-right">
                                <button className={`reward-btn`}>
                                    ₹ {task.reward_free}
                                </button>
                                <button className="toggle-btn" onClick={() => toggleExpand(task.id)}>
                                    {expandedTaskId === task.id ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
                                </button>
                            </div>
                        </div>

                        {expandedTaskId === task.id && (
                            <div className="task-expanded">
                                <div className="expanded-section">
                                    <h4>Task Reward</h4>
                                    <div className="reward-pricing">
                                        <div className="price-item">
                                            <div className="badge-members"><FaGem /> Members</div>
                                            <div className="price-value text-blue">₹ {task.reward_member}</div>
                                        </div>
                                        <div className="price-item">
                                            <div className="label-free">Free</div>
                                            <div className="price-value text-green">₹ {task.reward_free}</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="expanded-section">
                                    <h4>Terms and Condition</h4>
                                    <ul className="terms-list">
                                        <li>Must be completed before expiry.</li>
                                        <li>Genuine submissions only.</li>
                                        <li>Payment processed after verification.</li>
                                    </ul>
                                </div>
                                <button className="btn-take-task" style={{
                                    width: '100%',
                                    padding: '12px',
                                    marginTop: '15px',
                                    borderRadius: '8px',
                                    border: 'none',
                                    background: 'var(--primary-color)',
                                    color: 'white',
                                    fontWeight: '600',
                                    cursor: 'pointer'
                                }}>Take Task</button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Task;

