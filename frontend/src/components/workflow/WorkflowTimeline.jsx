import React from 'react';
import { WORKFLOW_STAGES } from '../../data/mockData';
import { Check, AlertCircle } from 'lucide-react';

export const WorkflowTimeline = ({ task }) => {
  if (!task) return null;

  const currentIdx = task.current_stage_index ?? 0;
  const isFailed = ['failed', 'offline', 'unable_to_verify'].includes(task.status);
  const isCompleted = task.status === 'completed';

  return (
    <div className="workflow-stepper">
      {WORKFLOW_STAGES.map((stage) => {
        const stageIdx = stage.index;
        const isPast = stageIdx < currentIdx || isCompleted;
        const isCurrent = stageIdx === currentIdx && !isCompleted && !isFailed;
        const isFailedStage = isFailed && stageIdx === currentIdx;
        const isSkippedApproval = stage.id === 'request_approval' && task.risk_level === 'low' && stageIdx <= currentIdx;

        // Find associated event if logged
        const associatedEvent = task.events?.find(e => 
          e.stage.toLowerCase().includes(stage.name.toLowerCase().split('.')[1]?.trim().slice(0, 8) || 'xyz')
        );

        let itemClass = "step-item";
        if (isFailedStage) itemClass += " failed";
        else if (isPast) itemClass += " completed";
        else if (isCurrent) itemClass += " current";

        return (
          <div key={stage.id} className={itemClass}>
            <div className="step-node">
              {isFailedStage ? (
                <AlertCircle size={13} />
              ) : isPast ? (
                <Check size={13} />
              ) : (
                stageIdx + 1
              )}
            </div>

            <div className="step-content">
              <div className="step-header">
                <span className="step-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {stage.name}
                  {isSkippedApproval && (
                    <span style={{ fontSize: '10px', color: 'var(--color-espresso-muted)', fontWeight: 400, fontStyle: 'italic' }}>
                      (Bypassed — Low Risk Policy)
                    </span>
                  )}
                  {isCurrent && (
                    <span className="badge badge-executing" style={{ fontSize: '10px', padding: '1px 6px' }}>
                      Active
                    </span>
                  )}
                  {isFailedStage && (
                    <span className="badge badge-failed" style={{ fontSize: '10px', padding: '1px 6px' }}>
                      {task.status.replace(/_/g, ' ')}
                    </span>
                  )}
                </span>

                {associatedEvent?.time && (
                  <span className="step-timestamp">
                    {associatedEvent.time}
                  </span>
                )}
              </div>

              <div className="step-desc">
                {associatedEvent?.description || stage.desc}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
