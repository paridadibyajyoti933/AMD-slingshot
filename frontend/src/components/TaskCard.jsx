import React from 'react';
import { CheckCircle2, Circle, Clock, AlertTriangle } from 'lucide-react';

const TaskCard = ({ task, onClick }) => {
    const getPriorityColor = (priority) => {
        const colors = {
            low: 'text-green-400 bg-green-400/10',
            medium: 'text-yellow-400 bg-yellow-400/10',
            high: 'text-orange-400 bg-orange-400/10',
            urgent: 'text-red-400 bg-red-400/10',
        };
        return colors[priority] || colors.medium;
    };

    const getStatusIcon = (status) => {
        const icons = {
            completed: <CheckCircle2 className="w-5 h-5 text-green-400" />,
            in_progress: <Clock className="w-5 h-5 text-yellow-400" />,
            todo: <Circle className="w-5 h-5 text-dark-400" />,
        };
        return icons[status] || icons.todo;
    };

    const isOverdue = task.deadline && new Date(task.deadline) < new Date() && task.status !== 'completed';

    return (
        <div
            onClick={onClick}
            className="card hover:border-primary-600/50 cursor-pointer group"
        >
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-start space-x-3 flex-1">
                    {getStatusIcon(task.status)}
                    <div className="flex-1">
                        <h3 className="font-semibold text-dark-100 group-hover:text-primary-400 transition-colors">
                            {task.title}
                        </h3>
                        {task.description && (
                            <p className="text-sm text-dark-400 mt-1 line-clamp-2">
                                {task.description}
                            </p>
                        )}
                    </div>
                </div>

                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                </span>
            </div>

            <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-4">
                    {task.deadline && (
                        <div className={`flex items-center space-x-1 ${isOverdue ? 'text-red-400' : 'text-dark-400'}`}>
                            {isOverdue && <AlertTriangle className="w-4 h-4" />}
                            <Clock className="w-4 h-4" />
                            <span>{new Date(task.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                        </div>
                    )}

                    {task.estimated_hours && (
                        <span className="text-dark-400">
                            {task.estimated_hours}h
                        </span>
                    )}
                </div>

                {task.priority_score && (
                    <div className="text-xs text-dark-500">
                        Score: {task.priority_score.toFixed(1)}
                    </div>
                )}
            </div>

            {task.tags && (
                <div className="flex flex-wrap gap-2 mt-3">
                    {task.tags.split(',').slice(0, 3).map((tag, idx) => (
                        <span
                            key={idx}
                            className="px-2 py-1 bg-dark-700 text-dark-300 text-xs rounded"
                        >
                            {tag.trim()}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TaskCard;
