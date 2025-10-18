/**
 * DASHBOARD CARDS DEMO PAGE
 * 
 * Showcase for all premium dashboard cards
 */

'use client';

import {
  ThemeProvider,
  ThemeSwitcher,
  MetricBarsCard,
  MiniMetricCard,
  DonutCard,
  ProgressCard,
  ActivityCard,
  StatCard,
  ChartCard,
  TableCard,
  Badge,
  Avatar,
  Tabs,
} from '@vantage-lane/ui-core';
import styles from './demo-cards.module.css';

export default function CardsDemoPage() {
  return (
    <ThemeProvider defaultTheme="vantageGold">
      <div className={styles.page}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <div>
              <h1 className={styles.title}>📊 Dashboard Cards Premium</h1>
              <p className={styles.subtitle}>All 8 Premium card types + Badge & Avatar ✨</p>
            </div>
            <ThemeSwitcher />
          </div>
        </header>

        {/* Main Content */}
        <main className={styles.content}>
          {/* Section 1: MetricBarsCard */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>1. MetricBarsCard 📊</h2>
            <p className={styles.sectionDesc}>
              Mini vertical bars for quick metrics overview
            </p>

            <div className={styles.cardsGrid}>
              <MetricBarsCard
                title="Weekly Sales"
                subtitle="Last 7 days performance"
                metrics={[
                  { label: 'Mon', value: 42, color: 'theme' },
                  { label: 'Tue', value: 58, color: 'theme' },
                  { label: 'Wed', value: 35, color: 'theme' },
                  { label: 'Thu', value: 72, color: 'theme' },
                  { label: 'Fri', value: 65, color: 'theme' },
                  { label: 'Sat', value: 48, color: 'theme' },
                  { label: 'Sun', value: 55, color: 'theme' },
                ]}
                totalLabel="Total Sales"
                totalValue="375"
                actionLabel="View Details"
                onActionClick={() => alert('View details clicked!')}
              />

              <MetricBarsCard
                title="Revenue by Product"
                subtitle="Top 5 products this month"
                metrics={[
                  { label: 'Pro', value: 8500, color: 'success' },
                  { label: 'Basic', value: 6200, color: 'theme' },
                  { label: 'Plus', value: 4800, color: 'info' },
                  { label: 'Ent', value: 3200, color: 'warning' },
                  { label: 'Free', value: 1200, color: 'danger' },
                ]}
                totalLabel="Total Revenue"
                totalValue="$23.9K"
                actionLabel="Export"
                onActionClick={() => alert('Export clicked!')}
              />

              <MetricBarsCard
                title="User Activity"
                subtitle="Active users per day"
                metrics={[
                  { label: 'Mon', value: 120 },
                  { label: 'Tue', value: 145 },
                  { label: 'Wed', value: 132 },
                  { label: 'Thu', value: 168 },
                  { label: 'Fri', value: 156 },
                ]}
                totalLabel="Avg Daily Users"
                totalValue="144"
              />
            </div>
          </section>

          {/* Section 2: MiniMetricCard */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>2. MiniMetricCard 📈</h2>
            <p className={styles.sectionDesc}>
              Compact cards with trend indicators
            </p>

            <div className={styles.cardsGrid}>
              <MiniMetricCard
                label="Total Revenue"
                value="$45,231"
                trend={12.5}
                trendLabel="vs last month"
                icon="dollar-circle"
                iconColor="success"
                actionLabel="Add"
                onActionClick={() => alert('Add clicked!')}
              />

              <MiniMetricCard
                label="Active Users"
                value="2,543"
                trend={8.2}
                trendLabel="vs last week"
                icon="users"
                iconColor="theme"
              />

              <MiniMetricCard
                label="Conversion Rate"
                value="3.24%"
                trend={-2.1}
                trendLabel="vs last month"
                icon="trending-down"
                iconColor="warning"
              />

              <MiniMetricCard
                label="Avg Order Value"
                value="$124"
                trend={15.3}
                icon="shopping-cart"
                iconColor="info"
              />

              <MiniMetricCard
                label="Customer Satisfaction"
                value="4.8"
                trend={0.3}
                trendLabel="vs last quarter"
                icon="star"
                iconColor="success"
              />

              <MiniMetricCard
                label="Response Time"
                value="1.2s"
                trend={-18.5}
                trendLabel="vs last week"
                icon="lightning"
                iconColor="danger"
              />
            </div>
          </section>

          {/* Section 3: DonutCard */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>3. DonutCard 🍩</h2>
            <p className={styles.sectionDesc}>
              Pure CSS donut chart with interactive legend
            </p>

            <div className={styles.cardsGrid}>
              <DonutCard
                title="Revenue by Category"
                subtitle="Q1 2024 breakdown"
                segments={[
                  { label: 'Products', value: 12500, color: 'theme' },
                  { label: 'Services', value: 8200, color: 'success' },
                  { label: 'Consulting', value: 5400, color: 'info' },
                  { label: 'Support', value: 3100, color: 'warning' },
                ]}
                centerLabel="Total"
                centerValue="$29.2K"
              />

              <DonutCard
                title="Traffic Sources"
                subtitle="Last 30 days"
                segments={[
                  { label: 'Direct', value: 42, color: 'theme' },
                  { label: 'Organic', value: 28, color: 'success' },
                  { label: 'Social', value: 18, color: 'info' },
                  { label: 'Referral', value: 12, color: 'purple' },
                ]}
                centerLabel="Visitors"
                centerValue="5.2K"
                showPercentage
              />
            </div>
          </section>

          {/* Section 4: ProgressCard */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>4. ProgressCard 📈</h2>
            <p className={styles.sectionDesc}>
              Animated progress bars with labels
            </p>

            <div className={styles.cardsGrid}>
              <ProgressCard
                title="Project Progress"
                subtitle="Current sprint goals"
                items={[
                  { label: 'Frontend Development', value: 85, max: 100, color: 'theme' },
                  { label: 'Backend API', value: 92, max: 100, color: 'success' },
                  { label: 'Testing', value: 45, max: 100, color: 'warning' },
                  { label: 'Documentation', value: 30, max: 100, color: 'info' },
                ]}
              />

              <ProgressCard
                title="Storage Usage"
                subtitle="By category"
                items={[
                  { label: 'Images', value: 45, max: 100, color: 'theme' },
                  { label: 'Videos', value: 78, max: 100, color: 'danger' },
                  { label: 'Documents', value: 23, max: 100, color: 'info' },
                ]}
              />
            </div>
          </section>

          {/* Section 5: ActivityCard */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>5. ActivityCard 📋</h2>
            <p className={styles.sectionDesc}>
              Timeline-style activity feed
            </p>

            <div className={styles.cardsGrid}>
              <ActivityCard
                title="Recent Activity"
                subtitle="Last 24 hours"
                activities={[
                  {
                    title: 'New order received',
                    description: 'Order #4523 from John Doe',
                    time: '2 minutes ago',
                    icon: 'shopping-cart',
                    iconColor: 'success',
                  },
                  {
                    title: 'Payment processed',
                    description: '$245.00 successfully charged',
                    time: '15 minutes ago',
                    icon: 'dollar-circle',
                    iconColor: 'theme',
                  },
                  {
                    title: 'New user registered',
                    description: 'sarah.johnson@example.com',
                    time: '1 hour ago',
                    icon: 'user-circle',
                    iconColor: 'info',
                  },
                  {
                    title: 'System update',
                    description: 'Database backup completed',
                    time: '3 hours ago',
                    icon: 'settings',
                    iconColor: 'warning',
                  },
                ]}
                showViewAll
                onViewAllClick={() => alert('View all clicked!')}
              />
            </div>
          </section>

          {/* Section 6: StatCard */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>6. StatCard 📊</h2>
            <p className={styles.sectionDesc}>
              Big stats with mini trend charts
            </p>

            <div className={styles.cardsGrid}>
              <StatCard
                label="Monthly Revenue"
                value="$52,431"
                trend={18.5}
                trendLabel="vs last month"
                chartData={[30, 35, 32, 38, 42, 45, 48, 52]}
                chartColor="success"
              />

              <StatCard
                label="Active Users"
                value="3,842"
                trend={-5.2}
                trendLabel="vs last week"
                chartData={[45, 42, 40, 38, 36, 35, 34, 32]}
                chartColor="danger"
              />

              <StatCard
                label="Page Views"
                value="128.5K"
                trend={24.3}
                chartData={[80, 95, 110, 105, 118, 122, 125, 128]}
                chartColor="theme"
              />
            </div>
          </section>

          {/* Section 7: ChartCard */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>7. ChartCard 📈</h2>
            <p className={styles.sectionDesc}>
              Full-size area chart with interactive tooltips
            </p>

            <div className={styles.cardsGrid}>
              <ChartCard
                title="Revenue Trend"
                subtitle="Last 7 days"
                data={[
                  { label: 'Mon', value: 4200 },
                  { label: 'Tue', value: 5800 },
                  { label: 'Wed', value: 4500 },
                  { label: 'Thu', value: 7200 },
                  { label: 'Fri', value: 6500 },
                  { label: 'Sat', value: 5900 },
                  { label: 'Sun', value: 6800 },
                ]}
                color="success"
                valuePrefix="$"
                showGrid
              />

              <ChartCard
                title="User Growth"
                subtitle="Monthly trend"
                data={[
                  { label: 'Jan', value: 1200 },
                  { label: 'Feb', value: 1850 },
                  { label: 'Mar', value: 2400 },
                  { label: 'Apr', value: 2100 },
                  { label: 'May', value: 2800 },
                  { label: 'Jun', value: 3200 },
                ]}
                color="theme"
              />
            </div>
          </section>

          {/* Section 8: TableCard UPGRADED */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>8. TableCard 📋 (UPGRADED!)</h2>
            <p className={styles.sectionDesc}>
              Full-featured data table with pagination, bulk selection, and actions
            </p>

            <div className={styles.cardsGrid}>
              {/* Basic Table */}
              <TableCard
                title="Top Products"
                subtitle="Best sellers this month"
                columns={[
                  { key: 'name', label: 'Product', sortable: true },
                  { key: 'sales', label: 'Sales', sortable: true, align: 'right' },
                  { key: 'revenue', label: 'Revenue', sortable: true, align: 'right' },
                ]}
                rows={[
                  { id: 1, name: 'Premium Plan', sales: 342, revenue: '$12,450' },
                  { id: 2, name: 'Basic Plan', sales: 589, revenue: '$8,835' },
                  { id: 3, name: 'Pro Plan', sales: 187, revenue: '$7,480' },
                  { id: 4, name: 'Enterprise', sales: 42, revenue: '$6,720' },
                ]}
                showViewAll
                onViewAllClick={() => alert('View all products!')}
              />

              {/* Table with Pagination */}
              <TableCard
                title="Customers (Paginated)"
                subtitle="15 customers, 5 per page"
                columns={[
                  { key: 'name', label: 'Name', sortable: true },
                  { key: 'email', label: 'Email', sortable: true },
                  { key: 'status', label: 'Status', align: 'center' },
                ]}
                rows={[
                  { id: 1, name: 'John Doe', email: 'john@example.com', status: '🟢 Active' },
                  { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: '🟢 Active' },
                  { id: 3, name: 'Bob Wilson', email: 'bob@example.com', status: '🟡 Pending' },
                  { id: 4, name: 'Alice Brown', email: 'alice@example.com', status: '🟢 Active' },
                  { id: 5, name: 'Charlie Davis', email: 'charlie@example.com', status: '🔴 Inactive' },
                  { id: 6, name: 'Diana Evans', email: 'diana@example.com', status: '🟢 Active' },
                  { id: 7, name: 'Frank Miller', email: 'frank@example.com', status: '🟢 Active' },
                  { id: 8, name: 'Grace Lee', email: 'grace@example.com', status: '🟡 Pending' },
                  { id: 9, name: 'Henry Taylor', email: 'henry@example.com', status: '🟢 Active' },
                  { id: 10, name: 'Ivy Anderson', email: 'ivy@example.com', status: '🟢 Active' },
                  { id: 11, name: 'Jack Thomas', email: 'jack@example.com', status: '🔴 Inactive' },
                  { id: 12, name: 'Kate Martinez', email: 'kate@example.com', status: '🟢 Active' },
                  { id: 13, name: 'Leo Garcia', email: 'leo@example.com', status: '🟢 Active' },
                  { id: 14, name: 'Mia Rodriguez', email: 'mia@example.com', status: '🟡 Pending' },
                  { id: 15, name: 'Noah Lopez', email: 'noah@example.com', status: '🟢 Active' },
                ]}
                enablePagination
                rowsPerPage={5}
                onRowClick={(row) => alert(`View customer: ${row.name}`)}
              />
            </div>

            {/* Table with Bulk Selection & Actions */}
            <div style={{ marginTop: 'var(--spacing-4)' }}>
              <TableCard
                title="Orders Management"
                subtitle="Select orders for bulk actions"
                columns={[
                  { key: 'orderNo', label: 'Order #', sortable: true },
                  { key: 'customer', label: 'Customer', sortable: true },
                  { key: 'amount', label: 'Amount', sortable: true, align: 'right' },
                  { key: 'status', label: 'Status', align: 'center' },
                ]}
                rows={[
                  { id: 'ORD-001', orderNo: 'ORD-001', customer: 'Acme Corp', amount: '$2,450', status: '🟢 Completed' },
                  { id: 'ORD-002', orderNo: 'ORD-002', customer: 'Tech Solutions', amount: '$1,850', status: '🟡 Processing' },
                  { id: 'ORD-003', orderNo: 'ORD-003', customer: 'Global Inc', amount: '$3,200', status: '🟢 Completed' },
                  { id: 'ORD-004', orderNo: 'ORD-004', customer: 'StartUp LLC', amount: '$890', status: '🟡 Processing' },
                  { id: 'ORD-005', orderNo: 'ORD-005', customer: 'Enterprise Co', amount: '$5,420', status: '🔴 Cancelled' },
                  { id: 'ORD-006', orderNo: 'ORD-006', customer: 'Cloud Systems', amount: '$1,230', status: '🟢 Completed' },
                ]}
                enableBulkSelection
                bulkActions={[
                  {
                    id: 'export',
                    label: 'Export',
                    icon: 'download',
                    onClick: (ids) => alert(`Exporting ${ids.length} orders: ${ids.join(', ')}`),
                  },
                  {
                    id: 'archive',
                    label: 'Archive',
                    icon: 'archive',
                    onClick: (ids) => alert(`Archiving ${ids.length} orders: ${ids.join(', ')}`),
                  },
                  {
                    id: 'delete',
                    label: 'Delete',
                    icon: 'trash',
                    variant: 'danger',
                    onClick: (ids) => {
                      if (confirm(`Delete ${ids.length} orders?`)) {
                        alert(`Deleted: ${ids.join(', ')}`);
                      }
                    },
                  },
                ]}
              />
            </div>
          </section>

          {/* Section 9: Badge */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>9. Badge 🏷️</h2>
            <p className={styles.sectionDesc}>
              Small labels for status, counts, categories
            </p>

            <div className={styles.badgeShowcase}>
              <div className={styles.badgeGroup}>
                <h4>Solid Variant</h4>
                <div className={styles.badgeFlex}>
                  <Badge color="theme">Theme</Badge>
                  <Badge color="success">Success</Badge>
                  <Badge color="warning">Warning</Badge>
                  <Badge color="danger">Danger</Badge>
                  <Badge color="info">Info</Badge>
                  <Badge color="neutral">Neutral</Badge>
                </div>
              </div>

              <div className={styles.badgeGroup}>
                <h4>Outline Variant</h4>
                <div className={styles.badgeFlex}>
                  <Badge variant="outline" color="theme">Theme</Badge>
                  <Badge variant="outline" color="success">Success</Badge>
                  <Badge variant="outline" color="warning">Warning</Badge>
                  <Badge variant="outline" color="danger">Danger</Badge>
                  <Badge variant="outline" color="info">Info</Badge>
                </div>
              </div>

              <div className={styles.badgeGroup}>
                <h4>Soft Variant</h4>
                <div className={styles.badgeFlex}>
                  <Badge variant="soft" color="theme">Theme</Badge>
                  <Badge variant="soft" color="success">Success</Badge>
                  <Badge variant="soft" color="warning">Warning</Badge>
                  <Badge variant="soft" color="danger">Danger</Badge>
                  <Badge variant="soft" color="info">Info</Badge>
                </div>
              </div>

              <div className={styles.badgeGroup}>
                <h4>With Icons</h4>
                <div className={styles.badgeFlex}>
                  <Badge icon="check" color="success">Verified</Badge>
                  <Badge icon="star" color="warning">Premium</Badge>
                  <Badge icon="clock" color="info">Pending</Badge>
                </div>
              </div>

              <div className={styles.badgeGroup}>
                <h4>Removable</h4>
                <div className={styles.badgeFlex}>
                  <Badge onRemove={() => alert('Removed!')} color="theme">Tag 1</Badge>
                  <Badge onRemove={() => alert('Removed!')} color="success">Tag 2</Badge>
                  <Badge onRemove={() => alert('Removed!')} color="info">Tag 3</Badge>
                </div>
              </div>

              <div className={styles.badgeGroup}>
                <h4>Sizes</h4>
                <div className={styles.badgeFlex}>
                  <Badge size="sm" color="theme">Small</Badge>
                  <Badge size="md" color="theme">Medium</Badge>
                  <Badge size="lg" color="theme">Large</Badge>
                </div>
              </div>
            </div>
          </section>

          {/* Section 10: Avatar */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>10. Avatar 👤</h2>
            <p className={styles.sectionDesc}>
              User avatars with images, initials, or icons
            </p>

            <div className={styles.badgeShowcase}>
              <div className={styles.badgeGroup}>
                <h4>With Initials</h4>
                <div className={styles.badgeFlex}>
                  <Avatar name="John Doe" size="xs" />
                  <Avatar name="Jane Smith" size="sm" />
                  <Avatar name="Bob Wilson" size="md" />
                  <Avatar name="Alice Brown" size="lg" />
                  <Avatar name="Charlie Davis" size="xl" />
                  <Avatar name="Sarah Johnson" size="2xl" />
                </div>
              </div>

              <div className={styles.badgeGroup}>
                <h4>With Status</h4>
                <div className={styles.badgeFlex}>
                  <Avatar name="John Doe" status="online" />
                  <Avatar name="Jane Smith" status="away" />
                  <Avatar name="Bob Wilson" status="busy" />
                  <Avatar name="Alice Brown" status="offline" />
                </div>
              </div>

              <div className={styles.badgeGroup}>
                <h4>Icon Fallback</h4>
                <div className={styles.badgeFlex}>
                  <Avatar icon="user-circle" />
                  <Avatar icon="users" size="lg" />
                </div>
              </div>
            </div>
          </section>

          {/* Section 11: Tabs */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>11. Tabs 📑 (NEW!)</h2>
            <p className={styles.sectionDesc}>
              Full-featured tabs with icons, badges, and keyboard navigation
            </p>

            <div className={styles.cardsGrid}>
              {/* Horizontal Default Tabs */}
              <div className={styles.tabDemo}>
                <h3>Default Variant</h3>
                <Tabs
                  tabs={[
                    {
                      id: 'overview',
                      label: 'Overview',
                      icon: 'chart-bar',
                      content: (
                        <div className={styles.tabContent}>
                          <h4>Dashboard Overview</h4>
                          <p>Welcome to your dashboard. Here you can see all your key metrics and statistics.</p>
                        </div>
                      ),
                    },
                    {
                      id: 'analytics',
                      label: 'Analytics',
                      icon: 'chart-pie',
                      badge: 12,
                      content: (
                        <div className={styles.tabContent}>
                          <h4>Analytics</h4>
                          <p>View detailed analytics and performance metrics.</p>
                        </div>
                      ),
                    },
                    {
                      id: 'users',
                      label: 'Users',
                      icon: 'users',
                      badge: '24',
                      badgeColor: 'success',
                      content: (
                        <div className={styles.tabContent}>
                          <h4>User Management</h4>
                          <p>Manage users and permissions.</p>
                        </div>
                      ),
                    },
                    {
                      id: 'settings',
                      label: 'Settings',
                      icon: 'settings',
                      content: (
                        <div className={styles.tabContent}>
                          <h4>Settings</h4>
                          <p>Configure your application settings.</p>
                        </div>
                      ),
                    },
                  ]}
                />
              </div>

              {/* Pills Variant */}
              <div className={styles.tabDemo}>
                <h3>Pills Variant</h3>
                <Tabs
                  variant="pills"
                  tabs={[
                    {
                      id: 'all',
                      label: 'All',
                      badge: 156,
                      content: (
                        <div className={styles.tabContent}>
                          <p>Showing all 156 items</p>
                        </div>
                      ),
                    },
                    {
                      id: 'active',
                      label: 'Active',
                      badge: 89,
                      badgeColor: 'success',
                      content: (
                        <div className={styles.tabContent}>
                          <p>89 active items</p>
                        </div>
                      ),
                    },
                    {
                      id: 'pending',
                      label: 'Pending',
                      badge: 45,
                      badgeColor: 'warning',
                      content: (
                        <div className={styles.tabContent}>
                          <p>45 pending items</p>
                        </div>
                      ),
                    },
                    {
                      id: 'completed',
                      label: 'Completed',
                      badge: 22,
                      content: (
                        <div className={styles.tabContent}>
                          <p>22 completed items</p>
                        </div>
                      ),
                    },
                  ]}
                />
              </div>
            </div>

            {/* Underline Variant Full Width */}
            <div style={{ marginTop: 'var(--spacing-4)' }}>
              <h3>Underline Variant (Full Width)</h3>
              <Tabs
                variant="underline"
                fullWidth
                tabs={[
                  {
                    id: 'profile',
                    label: 'Profile',
                    icon: 'user-circle',
                    content: (
                      <div className={styles.tabContent}>
                        <h4>User Profile</h4>
                        <p>Manage your profile information and preferences.</p>
                      </div>
                    ),
                  },
                  {
                    id: 'security',
                    label: 'Security',
                    icon: 'settings',
                    badge: '!',
                    badgeColor: 'warning',
                    content: (
                      <div className={styles.tabContent}>
                        <h4>Security Settings</h4>
                        <p>Update your password and security preferences.</p>
                      </div>
                    ),
                  },
                  {
                    id: 'notifications',
                    label: 'Notifications',
                    icon: 'star',
                    badge: 5,
                    badgeColor: 'danger',
                    content: (
                      <div className={styles.tabContent}>
                        <h4>Notification Settings</h4>
                        <p>Manage your notification preferences.</p>
                      </div>
                    ),
                  },
                  {
                    id: 'billing',
                    label: 'Billing',
                    icon: 'dollar-circle',
                    content: (
                      <div className={styles.tabContent}>
                        <h4>Billing & Payments</h4>
                        <p>View your billing history and payment methods.</p>
                      </div>
                    ),
                  },
                ]}
              />
            </div>

            {/* Vertical Tabs */}
            <div style={{ marginTop: 'var(--spacing-4)' }}>
              <h3>Vertical Orientation</h3>
              <Tabs
                orientation="vertical"
                tabs={[
                  {
                    id: 'general',
                    label: 'General',
                    icon: 'settings',
                    content: (
                      <div className={styles.tabContent}>
                        <h4>General Settings</h4>
                        <p>Configure general application settings.</p>
                      </div>
                    ),
                  },
                  {
                    id: 'appearance',
                    label: 'Appearance',
                    icon: 'star',
                    content: (
                      <div className={styles.tabContent}>
                        <h4>Appearance</h4>
                        <p>Customize the look and feel of your dashboard.</p>
                      </div>
                    ),
                  },
                  {
                    id: 'integrations',
                    label: 'Integrations',
                    icon: 'lightning',
                    badge: 'NEW',
                    badgeColor: 'info',
                    content: (
                      <div className={styles.tabContent}>
                        <h4>Integrations</h4>
                        <p>Connect with third-party services.</p>
                      </div>
                    ),
                  },
                ]}
              />
            </div>
          </section>

          {/* Info Panel */}
          <section className={styles.infoPanel}>
            <h3>✨ Premium Features</h3>
            <ul>
              <li><strong>10 Components:</strong> 8 Dashboard Cards + Badge + Avatar</li>
              <li><strong>Theme Integration:</strong> All components adapt to selected theme</li>
              <li><strong>Animations:</strong> Smooth entrance and hover effects</li>
              <li><strong>Responsive:</strong> Mobile-friendly layouts</li>
              <li><strong>Accessible:</strong> ARIA labels and keyboard navigation</li>
              <li><strong>TypeScript:</strong> Full type safety</li>
              <li><strong>Customizable:</strong> Props for all use cases</li>
              <li><strong>Professional Icons:</strong> 18 SVG icons included</li>
            </ul>

            <h3>🎯 Usage</h3>
            <pre className={styles.codeBlock}>
{`import { MetricBarsCard, MiniMetricCard } from '@vantage-lane/ui-core';

<MetricBarsCard
  title="Weekly Sales"
  metrics={[
    { label: 'Mon', value: 42 },
    { label: 'Tue', value: 58 },
  ]}
  totalValue="100"
/>`}
            </pre>
          </section>
        </main>
      </div>
    </ThemeProvider>
  );
}
