import { useState } from 'react';
import {
  Search, Mail, Lock, Eye, ChevronDown,
  Pencil, Copy, Archive, Trash2, MoreVertical,
  Plus, Download
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { InputIcon } from '../components/ui/InputIcon';
import { Card } from '../components/ui/Card';
import { Alert } from '../components/ui/Alert';
import { Toast } from '../components/ui/Toast';
import { Checkbox } from '../components/ui/Checkbox';
import { Radio } from '../components/ui/Radio';
import { Switch } from '../components/ui/Switch';
import { Dropdown } from '../components/ui/Dropdown';
import { Pagination } from '../components/ui/Pagination';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { EmptyState } from '../components/ui/EmptyState';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { Upload } from '../components/ui/Upload';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { Avatar } from '../components/ui/Avatar';
import { DropdownMenu } from '../components/ui/DropdownMenu';
import { DataTable } from '../components/ui/DataTable';
import { ProgressBar } from '../components/ui/ProgressBar';

export function Components() {
  const [currentPage, setCurrentPage] = useState(1);
  const [showToast, setShowToast] = useState(false);
  const [showAlert, setShowAlert] = useState(true);
  const [isChecked, setIsChecked] = useState(false);
  const [radioValue, setRadioValue] = useState('option1');
  const [isSwitchOn, setIsSwitchOn] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [progressValue, setProgressValue] = useState(65);

  // Sample data for DataTable
  const sampleData = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Active' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'User', status: 'Inactive' },
    { id: 4, name: 'Alice Williams', email: 'alice@example.com', role: 'Manager', status: 'Active' },
  ];

  const tableColumns = [
    { key: 'id', header: 'ID', sortable: true },
    { key: 'name', header: 'Name', sortable: true },
    { key: 'email', header: 'Email', sortable: true },
    {
      key: 'role',
      header: 'Role',
      render: (item: any) => <Badge variant="primary" size="sm">{item.role}</Badge>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (item: any) => (
        <Badge variant={item.status === 'Active' ? 'success' : 'default'} size="sm">
          {item.status}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-text-primary mb-2">UI Components</h1>
        <p className="text-text-secondary">
          Showcase semua komponen UI yang tersedia di sistem
        </p>
      </div>

      {/* 1. Buttons */}
      <Card title="1. Buttons" subtitle="Primary and Secondary variants with different sizes">
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-text-secondary mb-3">Primary Buttons</h4>
            <div className="flex flex-wrap gap-3">
              <Button variant="primary" size="small">Small</Button>
              <Button variant="primary" size="medium">Medium</Button>
              <Button variant="primary" size="large">Large</Button>
              <Button variant="primary" size="medium" disabled>Disabled</Button>
              <Button variant="primary" size="medium" isLoading>Loading</Button>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-text-secondary mb-3">Secondary Buttons</h4>
            <div className="flex flex-wrap gap-3">
              <Button variant="secondary" size="small">Small</Button>
              <Button variant="secondary" size="medium">Medium</Button>
              <Button variant="secondary" size="large">Large</Button>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-text-secondary mb-3">Other Variants</h4>
            <div className="flex flex-wrap gap-3">
              <Button variant="danger" size="medium">Danger</Button>
              <Button variant="ghost" size="medium">Ghost</Button>
            </div>
          </div>
        </div>
      </Card>

      {/* 2. Input Group with Error */}
      <Card title="2. Input Group" subtitle="Text inputs with validation and error states">
        <div className="space-y-4 max-w-md">
          <Input label="Name" placeholder="Enter your name" />
          <Input label="Email" type="email" placeholder="example@email.com" error="Invalid email address" />
          <Input label="Password" type="password" placeholder="Enter password" helperText="Must be at least 8 characters" />
          <Input label="Disabled" placeholder="This is disabled" disabled />
        </div>
      </Card>

      {/* 3. Input with Icon */}
      <Card title="3. Input with Icon" subtitle="Input fields with left and right icons">
        <div className="space-y-4 max-w-md">
          <InputIcon
            label="Search"
            placeholder="Search..."
            leftIcon={<Search className="w-5 h-5" />}
          />
          <InputIcon
            label="Email"
            type="email"
            placeholder="email@example.com"
            leftIcon={<Mail className="w-5 h-5" />}
          />
          <InputIcon
            label="Password"
            type="password"
            placeholder="Enter password"
            leftIcon={<Lock className="w-5 h-5" />}
            rightIcon={
              <button className="hover:text-text-primary">
                <Eye className="w-5 h-5" />
              </button>
            }
          />
        </div>
      </Card>

      {/* 4. Breadcrumb */}
      <Card title="4. Breadcrumb" subtitle="Navigation breadcrumb trail">
        <div className="space-y-4">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/vouchers' },
              { label: 'Settings', href: '/settings' },
              { label: 'Profile' },
            ]}
          />
          <Breadcrumb
            items={[
              { label: 'Dashboard', href: '/vouchers' },
              { label: 'Vouchers', href: '/vouchers' },
              { label: 'Create New Voucher' },
            ]}
          />
        </div>
      </Card>

      {/* 5. Badges */}
      <Card title="5. Badges" subtitle="Status and label indicators">
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-text-secondary mb-3">Variants</h4>
            <div className="flex flex-wrap gap-2">
              <Badge variant="default">Default</Badge>
              <Badge variant="primary">Primary</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="error">Error</Badge>
              <Badge variant="warning">Warning</Badge>
              <Badge variant="info">Info</Badge>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium text-text-secondary mb-3">Sizes</h4>
            <div className="flex flex-wrap items-center gap-2">
              <Badge size="sm" variant="primary">Small</Badge>
              <Badge size="md" variant="primary">Medium</Badge>
              <Badge size="lg" variant="primary">Large</Badge>
            </div>
          </div>
        </div>
      </Card>

      {/* 6. Avatar */}
      <Card title="6. Avatar" subtitle="User profile pictures or initials">
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-text-secondary mb-3">Sizes</h4>
            <div className="flex flex-wrap items-center gap-3">
              <Avatar size="xs" name="John Doe" />
              <Avatar size="sm" name="Jane Smith" />
              <Avatar size="md" name="Bob Johnson" />
              <Avatar size="lg" name="Alice Williams" />
              <Avatar size="xl" name="Charlie Brown" />
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium text-text-secondary mb-3">With Image</h4>
            <div className="flex flex-wrap items-center gap-3">
              <Avatar size="md" src="https://i.pravatar.cc/150?img=1" alt="User 1" />
              <Avatar size="md" src="https://i.pravatar.cc/150?img=2" alt="User 2" />
              <Avatar size="md" src="https://i.pravatar.cc/150?img=3" alt="User 3" />
            </div>
          </div>
        </div>
      </Card>

      {/* 7. Upload */}
      <Card title="7. Upload File" subtitle="Drag and drop file upload">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Upload
            label="Assignment File"
            accept=".svg,.png,.jpg,.gif"
            maxSize={5}
            helperText="SVG, PNG, JPG or GIF (max. 5MB)"
            onFileSelect={(file) => console.log('Selected file:', file)}
          />
          <Upload
            label="Profile Picture"
            accept=".svg,.png,.jpg,.gif"
            maxSize={5}
            helperText="SVG, PNG, JPG or GIF (max. 5MB)"
            error="File is too large (max 5MB)"
            onFileSelect={(file) => console.log('Selected file:', file)}
          />
        </div>
      </Card>

      {/* 8. Modal */}
      <Card title="8. Modal Dialog" subtitle="Popup modal windows">
        <div className="space-y-4">
          <Button variant="primary" onClick={() => setIsModalOpen(true)}>
            Open Modal
          </Button>

          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title="Confirm Action"
            footer={
              <>
                <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    alert('Confirmed!');
                    setIsModalOpen(false);
                  }}
                >
                  Confirm
                </Button>
              </>
            }
          >
            <p className="text-text-secondary">
              Are you sure you want to perform this action? This action cannot be undone.
            </p>
          </Modal>
        </div>
      </Card>

      {/* 9. Dropdown Menu */}
      <Card title="9. Dropdown Menu" subtitle="Action menu with icons">
        <div className="flex gap-4">
          <DropdownMenu
            trigger={
              <Button variant="secondary">
                Actions
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            }
            items={[
              {
                label: 'Edit',
                icon: <Pencil />,
                onClick: () => alert('Edit clicked'),
              },
              {
                label: 'Duplicate',
                icon: <Copy />,
                onClick: () => alert('Duplicate clicked'),
              },
              {
                label: 'Archive',
                icon: <Archive />,
                onClick: () => alert('Archive clicked'),
                divider: true,
              },
              {
                label: 'Delete',
                icon: <Trash2 />,
                onClick: () => alert('Delete clicked'),
                variant: 'danger',
              },
            ]}
          />

          <DropdownMenu
            trigger={
              <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                <MoreVertical className="w-5 h-5 text-text-secondary" />
              </button>
            }
            items={[
              {
                label: 'View Details',
                onClick: () => alert('View clicked'),
              },
              {
                label: 'Share',
                onClick: () => alert('Share clicked'),
              },
              {
                label: 'Download',
                onClick: () => alert('Download clicked'),
              },
            ]}
          />
        </div>
      </Card>

      {/* 10. DataTable */}
      <Card title="10. Data Table with Search" subtitle="Interactive table with search and sort">
        <DataTable
          data={sampleData}
          columns={tableColumns}
          searchable
          searchPlaceholder="Search by name, email, or role..."
          onRowClick={(item) => console.log('Row clicked:', item)}
        />
      </Card>

      {/* Previous components continue... */}
      <Card title="11. Card Component" subtitle="Container with title and subtitle">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-primary-soft">
            <p className="text-text-primary">Card dengan background custom</p>
          </Card>
          <Card title="Nested Card" subtitle="Card di dalam card">
            <p className="text-text-secondary text-sm">Content goes here...</p>
          </Card>
        </div>
      </Card>

      {/* Form Controls */}
      <Card title="12. Form Controls" subtitle="Dropdown, Checkbox, Radio Button, and Switch">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Dropdown
              label="Select Option"
              options={[
                { value: '', label: 'Choose an option' },
                { value: 'option1', label: 'Option 1' },
                { value: 'option2', label: 'Option 2' },
                { value: 'option3', label: 'Option 3' },
              ]}
            />
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-text-primary mb-2">Checkbox</p>
              <div className="space-y-2">
                <Checkbox
                  label="Accept terms and conditions"
                  checked={isChecked}
                  onChange={(e) => setIsChecked(e.target.checked)}
                />
                <Checkbox label="Subscribe to newsletter" />
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-text-primary mb-2">Radio Button</p>
              <div className="space-y-2">
                <Radio
                  label="Option 1"
                  name="radio-group"
                  value="option1"
                  checked={radioValue === 'option1'}
                  onChange={(e) => setRadioValue(e.target.value)}
                />
                <Radio
                  label="Option 2"
                  name="radio-group"
                  value="option2"
                  checked={radioValue === 'option2'}
                  onChange={(e) => setRadioValue(e.target.value)}
                />
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-text-primary mb-2">Switch</p>
              <div className="space-y-2">
                <Switch
                  label="Enable notifications"
                  checked={isSwitchOn}
                  onChange={(e) => setIsSwitchOn(e.target.checked)}
                />
                <Switch label="Dark mode" />
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Pagination */}
      <Card title="13. Pagination" subtitle="Navigate through pages">
        <Pagination
          currentPage={currentPage}
          totalPages={10}
          onPageChange={setCurrentPage}
          showInfo
          totalItems={95}
          itemsPerPage={10}
        />
      </Card>

      {/* Buttons with Icon */}
      <Card title="14. Buttons with Icon" subtitle="Buttons combined with icons">
        <div className="flex flex-wrap gap-3">
          <Button variant="primary" size="medium" className="flex items-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>Add New</span>
          </Button>

          <Button variant="secondary" size="medium" className="flex items-center space-x-2">
            <Download className="w-5 h-5" />
            <span>Download</span>
          </Button>
        </div>
      </Card>

      {/* Toast */}
      <Card title="15. Toast Notifications" subtitle="Temporary notification messages">
        <div className="space-y-4">
          <Button variant="primary" onClick={() => setShowToast(true)}>
            Show Toast
          </Button>

          {showToast && (
            <div className="space-y-3">
              <Toast variant="success" message="Voucher created successfully!" onClose={() => setShowToast(false)} />
              <Toast variant="error" message="Failed to delete voucher" />
              <Toast variant="warning" message="This action cannot be undone" />
              <Toast variant="info" message="New update available" />
            </div>
          )}
        </div>
      </Card>

      {/* Alert */}
      <Card title="16. Alert Messages" subtitle="Important contextual messages">
        <div className="space-y-4">
          {showAlert && (
            <>
              <Alert
                variant="info"
                title="Information"
                description="This is an info alert with details."
              />
              <Alert
                variant="success"
                title="Success!"
                description="Operation completed successfully."
                onClose={() => setShowAlert(false)}
              />
              <Alert
                variant="warning"
                title="Warning"
                description="Please check your connection."
              />
              <Alert
                variant="error"
                title="Error"
                description="Something went wrong."
              />
            </>
          )}
          {!showAlert && (
            <Button variant="secondary" onClick={() => setShowAlert(true)}>
              Show Alerts
            </Button>
          )}
        </div>
      </Card>

      {/* Empty State */}
      <Card title="17. Empty State" subtitle="Display when no data is available">
        <div className="bg-muted rounded-lg p-6">
          <EmptyState
            title="No vouchers found"
            description="Create your first voucher to get started!"
            actionLabel="Create Voucher"
            onAction={() => alert('Navigate to create voucher')}
          />
        </div>
      </Card>

      {/* Loading States */}
      <Card title="18. Loading Indicators" subtitle="Different loading animations">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center space-y-3">
            <p className="text-sm font-medium text-text-secondary">Spinner</p>
            <div className="flex justify-center">
              <LoadingSpinner variant="spinner" size="sm" />
            </div>
            <div className="flex justify-center">
              <LoadingSpinner variant="spinner" size="md" />
            </div>
            <div className="flex justify-center">
              <LoadingSpinner variant="spinner" size="lg" />
            </div>
          </div>

          <div className="text-center space-y-3">
            <p className="text-sm font-medium text-text-secondary">Dots</p>
            <div className="flex justify-center">
              <LoadingSpinner variant="dots" size="sm" />
            </div>
            <div className="flex justify-center">
              <LoadingSpinner variant="dots" size="md" />
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium text-text-secondary text-center">Skeleton</p>
            <LoadingSpinner variant="skeleton" />
          </div>
        </div>
      </Card>

      {/* Progress Bar */}
      <Card title="19. Progress Bar" subtitle="Visual progress indicators with different variants">
        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-medium text-text-secondary mb-3">Sizes</h4>
            <div className="space-y-3">
              <ProgressBar value={progressValue} size="sm" showLabel label="Small" />
              <ProgressBar value={progressValue} size="md" showLabel label="Medium" />
              <ProgressBar value={progressValue} size="lg" showLabel label="Large" />
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-text-secondary mb-3">Variants</h4>
            <div className="space-y-3">
              <ProgressBar value={30} variant="default" showLabel label="Default" />
              <ProgressBar value={50} variant="primary" showLabel label="Primary" />
              <ProgressBar value={75} variant="success" showLabel label="Success" />
              <ProgressBar value={60} variant="error" showLabel label="Error" />
              <ProgressBar value={45} variant="warning" showLabel label="Warning" />
              <ProgressBar value={90} variant="info" showLabel label="Info" />
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-text-secondary mb-3">Striped & Animated</h4>
            <div className="space-y-3">
              <ProgressBar value={progressValue} variant="primary" showLabel label="Striped" striped />
              <ProgressBar value={progressValue} variant="success" showLabel label="Animated Striped" striped animated />
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-text-secondary mb-3">Interactive</h4>
            <div className="space-y-3">
              <ProgressBar value={progressValue} variant="primary" size="md" showLabel label="Upload Progress" />
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="small"
                  onClick={() => setProgressValue(Math.max(0, progressValue - 10))}
                >
                  -10%
                </Button>
                <Button
                  variant="secondary"
                  size="small"
                  onClick={() => setProgressValue(Math.min(100, progressValue + 10))}
                >
                  +10%
                </Button>
                <Button
                  variant="ghost"
                  size="small"
                  onClick={() => setProgressValue(0)}
                >
                  Reset
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default Components;
