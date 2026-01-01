import React, { useState, useEffect } from 'react';
<<<<<<< Updated upstream
import { FaUsers, FaCopy, FaSearch, FaFilter, FaSort, FaGem, FaBuilding, FaRocket, FaEdit, FaYoutube, FaFilePdf, FaChevronRight, FaPlay } from 'react-icons/fa';
=======
import { FaUsers, FaSearch, FaFilter, FaSort, FaGem, FaBuilding, FaRocket, FaEdit, FaPlay } from 'react-icons/fa';
>>>>>>> Stashed changes
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/md';
import { supabase } from '../supabaseClient';
import './Task.css';

const Task = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filter & Sort States
    const [selectedProfessions, setSelectedProfessions] = useState({
        'All': true,
        'Student': false,
        'House Wife': false,
        'Working Professional': false,
        'Part Time': false
    });

    const [selectedTypes, setSelectedTypes] = useState({
        'All': true,
        'Daily': false,
        'Weekly': false,
        'Company': false,
        'Dedicated': false
    });

    const [sortOption, setSortOption] = useState('newest');
    const [activeTab, setActiveTab] = useState('All Task');
    const [expandedTaskId, setExpandedTaskId] = useState(null);
    const [filters, setFilters] = useState({ profession: null, type: null });
    const [sortBy, setSortBy] = useState('relevance');

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

    const handleTakeTask = async (task) => {
        if (task.action_link) {
            window.open(task.action_link, '_blank');
        }

        // Track task start in backend
        try {
            const { error } = await supabase.functions.invoke('dashboard-api', {
                body: { action: 'start-task', taskId: task.id }
            });
            if (error) console.error('Error starting task:', error);
        } catch (err) {
            console.error('Failed to start task:', err);
        }
    };

    const handleSmartAction = (task) => {
        // Unified action handler
        // If task has steps or video, maybe show them first? 
        // For now, simpler logic:
        handleTakeTask(task);
    };

    const getSmartButtonLabel = (task) => {
        // Mock status logic - in real app, check task.status
        if (task.status === 'in_progress') return 'Resume Task';
        if (task.status === 'completed') return 'Claim Reward';
        return 'Start Task';
    };

    const handleProfessionChange = (prof) => {
        if (prof === 'All') {
            setSelectedProfessions({
                'All': true,
                'Student': false,
                'House Wife': false,
                'Working Professional': false,
                'Part Time': false
            });
        } else {
            setSelectedProfessions(prev => ({ ...prev, [prof]: !prev[prof], 'All': false }));
        }
    };

    const handleTypeChange = (type) => {
        if (type === 'All') {
            setSelectedTypes({
                'All': true,
                'Daily': false,
                'Weekly': false,
                'Company': false,
                'Dedicated': false
            });
        } else {
            setSelectedTypes(prev => ({ ...prev, [type]: !prev[type], 'All': false }));
        }
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

    const getSmartButtonLabel = (task) => {
        // Mock status logic - in real app, check task.status or user_task_status
        if (task.status === 'in_progress') return 'Resume Task';
        if (task.status === 'completed') return 'Claim Reward';
        return 'Start Task';
    };

    const handleSmartAction = (task) => {
        const label = getSmartButtonLabel(task);
        if (label === 'Resume Task') {
            console.log('Resuming', task.id);
        } else if (label === 'Claim Reward') {
            console.log('Claiming', task.id);
        } else {
            console.log('Starting', task.id);
        }
    };

    const getFilteredTasks = () => {
        let filtered = [...tasks];

        // Tab Filter
        if (activeTab === 'Completed') filtered = filtered.filter(t => t.status === 'completed');
        if (activeTab === 'Ongoing') filtered = filtered.filter(t => t.status === 'in_progress');

        // Dropdown Filters
        if (filters.profession) {
            filtered = filtered.filter(t => t.category?.includes(filters.profession) || t.description?.includes(filters.profession));
        }
        if (filters.type) {
            filtered = filtered.filter(t => t.type === filters.type);
        }

        // Sort
        switch (sortBy) {
            case 'newest':
                filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                break;
            case 'relevance':
                // Default order usually
                break;
            case 'reward_high':
                filtered.sort((a, b) => (b.reward_free || 0) - (a.reward_free || 0));
                break;
            default:
                break;
        }
        return filtered;
    };

    if (loading) return <div className="loading">Loading Tasks...</div>;

    // Filtering Logic
    const filteredTasks = tasks.filter(task => {
        // 1. Tab Filter
        if (activeTab === 'Completed' && task.status !== 'completed') return false;
        if (activeTab === 'Ongoing' && task.status !== 'in_progress') return false;

        // 2. Profession Filter
        const activeProfessions = Object.keys(selectedProfessions).filter(k => k !== 'All' && selectedProfessions[k]);
        const professionMatch = selectedProfessions['All'] ||
            (task.target_audience && task.target_audience.some(aud => activeProfessions.includes(aud))) ||
            (!task.target_audience);

        // 3. Type Filter
        const activeTypes = Object.keys(selectedTypes).filter(k => k !== 'All' && selectedTypes[k]);
        const typeMatch = selectedTypes['All'] ||
            activeTypes.some(t => task.category && task.category.toLowerCase().includes(t.toLowerCase()));

        return professionMatch && typeMatch;
    }).sort((a, b) => {
        if (sortOption === 'reward_high') return (b.reward_free || 0) - (a.reward_free || 0);
        if (sortOption === 'reward_low') return (a.reward_free || 0) - (b.reward_free || 0);
        // newest
        return new Date(b.created_at) - new Date(a.created_at);
    });

    return (
        <div className="task-page">
            <div className="task-search-container">
                <FaSearch className="search-icon" />
                <input type="text" placeholder="Search tasks" className="task-search-input" />
            </div>

<<<<<<< Updated upstream
            <div className="row">
                {/* Sidebar */}
                <div className="col-lg-3 mb-4">
                    <div className="filters-sidebar">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5 className="mb-0"><FaFilter className="me-2" /> Filters</h5>
                        </div>

                        <div className="filter-group mb-4">
                            <h6 className="filter-title">Profession</h6>
                            {Object.keys(selectedProfessions).map(prof => (
                                <div className="form-check" key={prof}>
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id={`prof-${prof}`}
                                        checked={selectedProfessions[prof]}
                                        onChange={() => handleProfessionChange(prof)}
                                    />
                                    <label className="form-check-label" htmlFor={`prof-${prof}`}>
                                        {prof}
                                    </label>
                                </div>
                            ))}
                        </div>

                        <div className="filter-group">
                            <h6 className="filter-title">Type of Task</h6>
                            {Object.keys(selectedTypes).map(type => (
                                <div className="form-check" key={type}>
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id={`type-${type}`}
                                        checked={selectedTypes[type]}
                                        onChange={() => handleTypeChange(type)}
                                    />
                                    <label className="form-check-label" htmlFor={`type-${type}`}>
                                        {type}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Task List */}
                <div className="col-lg-9">
                    <div className="task-header-controls">
                        <div className="task-tabs">
                            <button className={`task-tab ${activeTab === 'All Task' ? 'active' : ''}`} onClick={() => setActiveTab('All Task')}>All Task</button>
                            <button className={`task-tab ${activeTab === 'Completed' ? 'active' : ''}`} onClick={() => setActiveTab('Completed')}>Completed</button>
                            <button className={`task-tab ${activeTab === 'Ongoing' ? 'active' : ''}`} onClick={() => setActiveTab('Ongoing')}>Ongoing</button>
                        </div>
                        <div className="task-actions">
                            <select className="form-select sort-select" value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
                                <option value="newest">Sort by: Newest</option>
                                <option value="reward_high">Reward: High to Low</option>
                                <option value="reward_low">Reward: Low to High</option>
                            </select>
                        </div>
                    </div>

                    <div className="task-list">
                        {filteredTasks.map((task) => (
                            <div className="task-card" key={task.id}>
                                <div className="task-card-header" onClick={() => toggleExpand(task.id)}>
                                    <div className="task-left">
                                        <div className={`task-icon-wrapper icon-red-gradient`}>
                                            {getIcon(task.icon_type)}
                                        </div>
                                        <div className="task-info">
                                            <h3>{task.title}</h3>
                                            <div className="task-meta">
                                                <span>{task.category || task.type}</span>
                                            </div>
                                        </div>
=======
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
                <div className="task-actions gap-2">
                    <div className="dropdown d-inline-block">
                        <button className="action-btn dropdown-toggle" type="button" id="filterDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                            Filter <FaFilter style={{ marginLeft: 8 }} />
                        </button>
                        <ul className="dropdown-menu p-3 border-0 shadow" aria-labelledby="filterDropdown" style={{ minWidth: '250px' }}>
                            <li><h6 className="dropdown-header px-0 text-uppercase small text-muted">By Profession</h6></li>
                            {['All', 'Student', 'Housewife', 'Working Professional'].map(p => (
                                <li key={p}>
                                    <button
                                        className={`dropdown-item rounded-2 ${filters.profession === p ? 'active' : ''}`}
                                        onClick={() => setFilters({ ...filters, profession: p === 'All' ? null : p })}
                                    >
                                        {p}
                                    </button>
                                </li>
                            ))}
                            <li><hr className="dropdown-divider" /></li>
                            <li><h6 className="dropdown-header px-0 text-uppercase small text-muted">By Type</h6></li>
                            {['All', 'Daily Task', 'Weekly Task', 'Company Task', 'Dedicated Task'].map(t => (
                                <li key={t}>
                                    <button
                                        className={`dropdown-item rounded-2 ${filters.type === t ? 'active' : ''}`}
                                        onClick={() => setFilters({ ...filters, type: t === 'All' ? null : t })}
                                    >
                                        {t}
                                    </button>
                                </li>
                            ))}
                            <li><hr className="dropdown-divider" /></li>
                            <li>
                                <button className="btn btn-sm btn-outline-danger w-100" onClick={() => setFilters({ profession: null, type: null })}>
                                    Clear Filters
                                </button>
                            </li>
                        </ul>
                    </div>

                    <div className="dropdown d-inline-block">
                        <button className="action-btn dropdown-toggle" type="button" id="sortDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                            Sort <FaSort style={{ marginLeft: 8 }} />
                        </button>
                        <ul className="dropdown-menu border-0 shadow" aria-labelledby="sortDropdown">
                            <li><button className="dropdown-item" onClick={() => setSortBy('relevance')}>Relevance</button></li>
                            <li><button className="dropdown-item" onClick={() => setSortBy('newest')}>Newest First</button></li>
                            <li><button className="dropdown-item" onClick={() => setSortBy('reward_high')}>Reward: High to Low</button></li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="task-list">
                {getFilteredTasks().map((task) => (
                    <div className="task-card" key={task.id}>
                        <div className="task-card-header">
                            <div className="task-left">
                                <div className={`task-icon-wrapper icon-red-gradient`}>
                                    {getIcon(task.icon_type)}
                                </div>
                                <div className="task-info">
                                    <h3 onClick={() => toggleExpand(task.id)} style={{ cursor: 'pointer' }} className="task-title-hover">
                                        {task.title}
                                    </h3>
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
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <h4>Task Reward</h4>
                                        {task.video_link && (
                                            <div className="video-guidance d-flex align-items-center text-primary" style={{ cursor: 'pointer' }}>
                                                <FaPlay className="me-1" size={12} />
                                                <small>Watch Guidance</small>
                                            </div>
                                        )}
                                    </div>
                                    <div className="reward-pricing">
                                        {(task.reward_member && task.reward_member > 0) ? (
                                            <>
                                                <div className="price-item">
                                                    <div className="badge-members"><FaGem /> Members</div>
                                                    <div className="price-value text-blue">₹ {task.reward_member}</div>
                                                </div>
                                                <div className="price-item">
                                                    <div className="label-free">Free</div>
                                                    <div className="price-value text-green">₹ {task.reward_free}</div>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="price-item w-100 flex-column align-items-start">
                                                <div className="price-value text-primary fs-3">₹ {task.reward_free}</div>
                                                {task.reward_info && (
                                                    <p className="text-muted small mt-1 mb-0">{task.reward_info}</p>
                                                )}
                                            </div>
                                        )}
>>>>>>> Stashed changes
                                    </div>
                                    <div className="task-right">
                                        <button className={`reward-btn`}>
                                            ₹ {task.reward_free || task.reward}
                                        </button>
                                        <button className="toggle-btn">
                                            {expandedTaskId === task.id ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
                                        </button>
                                    </div>
                                </div>

<<<<<<< Updated upstream
                                {expandedTaskId === task.id && (
                                    <div className="task-expanded pt-0">
                                        <div className="expanded-section mt-3">
                                            <div className="reward-pricing">
                                                <div className="price-item">
                                                    <div className="badge-members"><FaGem /> Members</div>
                                                    <div className="price-value text-blue">₹ {task.reward_member || task.reward_premium || task.reward || 800}</div>
                                                </div>
                                                <div className="price-item">
                                                    <div className="label-free">Free</div>
                                                    <div className="price-value text-green">₹ {task.reward_free || task.reward || 600}</div>
                                                </div>
                                            </div>
                                            {task.reward_info && (
                                                <p className="text-muted small mt-2"><FaGem className="me-1" />{task.reward_info}</p>
                                            )}
                                        </div>

                                        {(task.video_url || task.video_link || task.pdf_url) && (
                                            <div className="mt-3">
                                                {(task.video_url || task.video_link) && (
                                                    <div className="resource-link" onClick={() => window.open(task.video_url || task.video_link, '_blank')}>
                                                        <div style={{ width: 24 }}></div>
                                                        <span>Task Guidance Video</span>
                                                        <div className="ms-auto"><FaYoutube style={{ color: 'red', fontSize: '24px' }} /></div>
                                                    </div>
                                                )}
                                                {task.pdf_url && (
                                                    <div className="resource-link mt-2" onClick={() => window.open(task.pdf_url, '_blank')}>
                                                        <div style={{ width: 24 }}></div>
                                                        <span>Task Information</span>
                                                        <div className="ms-auto"><FaFilePdf style={{ color: '#e53935', fontSize: '24px' }} /></div>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        <div className="mt-3">
                                            <button
                                                className="btn-take-task w-100"
                                                onClick={() => handleSmartAction(task)}
                                            >
                                                {getSmartButtonLabel(task)}
                                            </button>
                                        </div>
                                    </div>
                                )}
=======
                                <div className="expanded-section">
                                    <h4>Terms and Condition</h4>
                                    <ul className="terms-list">
                                        {task.steps ? (
                                            // Handle steps if they exist as parsed array or string
                                            <li>Follow the steps provided in the video.</li>
                                        ) : (
                                            <>
                                                <li>Must be completed before expiry.</li>
                                                <li>Genuine submissions only.</li>
                                                <li>Payment processed after verification.</li>
                                            </>
                                        )}
                                    </ul>
                                </div>
                                <button
                                    className="btn-take-task"
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        marginTop: '15px',
                                        borderRadius: '8px',
                                        border: 'none',
                                        background: 'var(--primary-color)',
                                        color: 'white',
                                        fontWeight: '600',
                                        cursor: 'pointer'
                                    }}
                                    onClick={() => handleSmartAction(task)}
                                >
                                    {getSmartButtonLabel(task)}
                                </button>
>>>>>>> Stashed changes
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Task;
