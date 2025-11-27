/**
 * Projects Status List Component
 * 
 * Lista cu status-ul proiectelor din ecosistem
 * Conform RULES.md: <50 linii, single responsibility
 */

'use client';

import { Card, Badge } from '@vantage-lane/ui-core';
import { CrossProjectMetrics } from '@entities/sentry';
import * as Sentry from "@sentry/nextjs";
import styles from './ProjectsStatusList.module.css';

interface ProjectsStatusListProps {
  metrics: CrossProjectMetrics | null;
}

const { logger } = Sentry;

export function ProjectsStatusList({ metrics }: ProjectsStatusListProps): JSX.Element {
  const projects = [
    { name: 'Admin Dashboard', status: 'active', errors: metrics?.adminDashboard?.errorCount || 0 },
    { name: 'Landing Page', status: 'not-deployed', errors: 0 },
    { name: 'Backend Prices', status: 'not-deployed', errors: 0 },
    { name: 'Driver App', status: 'not-deployed', errors: 0 },
    { name: 'Client App', status: 'not-deployed', errors: 0 }
  ];

  const handleProjectClick = (project: any) => {
    logger.info("Project clicked", { projectName: project.name });
  };

  return (
    <Card className={styles.projectsCard || ""}>
      <h3 className={styles.cardTitle || ""}>Projects Status</h3>
      
      <div className={styles.projectsList || ""}>
        {projects.map((project, index) => (
          <div 
            key={index} 
            className={styles.projectItem || ""}
            onClick={() => handleProjectClick(project)}
          >
            <span className={styles.projectName || ""}>{project.name}</span>
            <Badge color={project.status === 'active' ? 'success' : 'neutral'}>
              {project.status}
            </Badge>
            <span className={styles.errors || ""}>{project.errors} errors</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
