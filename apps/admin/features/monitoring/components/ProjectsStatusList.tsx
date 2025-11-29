/**
 * Projects Status List Component
 * 
 * Lista cu status-ul proiectelor din ecosistem
 * Conform RULES.md: <50 linii, single responsibility
 */

'use client';

import { useMemo } from 'react';
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
    { id: '1', name: 'Admin Dashboard', status: 'active', errors: metrics?.adminDashboard?.errorCount || 0 },
    { id: '2', name: 'Landing Page', status: 'not-deployed', errors: 0 },
    { id: '3', name: 'Backend Prices', status: 'not-deployed', errors: 0 },
    { id: '4', name: 'Driver App', status: 'not-deployed', errors: 0 },
    { id: '5', name: 'Client App', status: 'not-deployed', errors: 0 }
  ];

  const handleProjectClick = (project: { id: string; name: string; status: string }) => {
    logger.info("Project clicked", { projectName: project.name });
  };

  // Memoize projects list to prevent re-creation on every render
  const projectItems = useMemo(() => 
    projects.map((project, index) => (
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
    )), 
    [projects]
  );

  return (
    <Card className={styles.projectsCard || ""}>
      <h3 className={styles.cardTitle || ""}>Projects Status</h3>
      
      <div className={styles.projectsList || ""}>
        {projectItems}
      </div>
    </Card>
  );
}
