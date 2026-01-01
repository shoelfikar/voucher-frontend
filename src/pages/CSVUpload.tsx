import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Upload as UploadIcon } from 'lucide-react';
import Papa from 'papaparse';
import { Upload } from '../components/ui/Upload';
import { Button } from '../components/ui/Button';
import { Alert } from '../components/ui/Alert';
import { DataTable } from '../components/ui/DataTable';
import { ProgressBar } from '../components/ui/ProgressBar';
import { useVoucher } from '../contexts/VoucherContext';
import type { CreateVoucherRequest, BatchImportResult } from '../services/voucherService';

interface VoucherRow {
  voucher_code: string;
  discount_percent: number;
  expiry_date: string;
}

interface UploadState {
  file: File | null;
  parsedData: VoucherRow[];
  previewData: VoucherRow[];
  totalRows: number;
  isUploading: boolean;
  progress: number;
  currentBatch: number;
  totalBatches: number;
  errors: string[];
}

interface AggregatedResult {
  totalRows: number;
  totalInserted: number;
  totalDuplicates: number;
  totalErrors: number;
  duplicateCodes: string[];
  errorMessages: string[];
  duration: number;
}

const BATCH_SIZE = 1000;

const CSVUpload = () => {
  const navigate = useNavigate();
  const { importBatch } = useVoucher();

  const [state, setState] = useState<UploadState>({
    file: null,
    parsedData: [],
    previewData: [],
    totalRows: 0,
    isUploading: false,
    progress: 0,
    currentBatch: 0,
    totalBatches: 0,
    errors: [],
  });

  const [uploadResult, setUploadResult] = useState<AggregatedResult | null>(null);
  const [parseError, setParseError] = useState<string>('');

  const parseCSV = async (file: File) => {
    setParseError('');
    setUploadResult(null);

    return new Promise<VoucherRow[]>((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          try {
            // Validate columns
            const data = results.data as any[];
            if (data.length === 0) {
              reject(new Error('CSV file is empty'));
              return;
            }

            const firstRow = data[0];
            const requiredColumns = ['voucher_code', 'discount_percent', 'expiry_date'];
            const missingColumns = requiredColumns.filter(col => !(col in firstRow));

            if (missingColumns.length > 0) {
              reject(new Error(`Missing required columns: ${missingColumns.join(', ')}`));
              return;
            }

            // Transform data
            const vouchers: VoucherRow[] = data.map((row: any) => ({
              voucher_code: String(row.voucher_code || '').trim(),
              discount_percent: Number(row.discount_percent || 0),
              expiry_date: String(row.expiry_date || '').trim(),
            }));

            resolve(vouchers);
          } catch (error: any) {
            reject(new Error('Failed to parse CSV file: ' + error.message));
          }
        },
        error: (error) => {
          reject(new Error('Failed to read CSV file: ' + error.message));
        },
      });
    });
  };

  const handleFileSelect = async (file: File) => {
    setParseError('');
    setUploadResult(null);

    // Validate file type
    if (!file.name.endsWith('.csv')) {
      setParseError('Please select a valid CSV file');
      return;
    }

    // Validate file size (max 10MB)
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > 10) {
      setParseError('File size must not exceed 10MB');
      return;
    }

    try {
      const parsedData = await parseCSV(file);
      const previewData = parsedData.slice(0, 10);
      const totalBatches = Math.ceil(parsedData.length / BATCH_SIZE);

      setState({
        file,
        parsedData,
        previewData,
        totalRows: parsedData.length,
        isUploading: false,
        progress: 0,
        currentBatch: 0,
        totalBatches,
        errors: [],
      });
    } catch (error: any) {
      setParseError(error.message || 'Failed to parse CSV file');
    }
  };

  const createBatches = <T,>(data: T[], batchSize: number): T[][] => {
    const batches: T[][] = [];
    for (let i = 0; i < data.length; i += batchSize) {
      batches.push(data.slice(i, i + batchSize));
    }
    return batches;
  };

  const uploadBatches = async () => {
    const startTime = Date.now();
    const batches = createBatches(state.parsedData, BATCH_SIZE);
    const results: BatchImportResult[] = [];

    setState(prev => ({ ...prev, isUploading: true, progress: 0, currentBatch: 0 }));

    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      const batchNumber = i + 1;

      try {
        // Update progress
        setState(prev => ({
          ...prev,
          currentBatch: batchNumber,
          progress: (batchNumber / batches.length) * 100
        }));

        // Upload batch
        const result = await importBatch(batch as CreateVoucherRequest[]);
        results.push(result);

      } catch (error: any) {
        // If batch fails, record it
        results.push({
          total_received: batch.length,
          inserted: 0,
          duplicates: 0,
          duplicate_codes: [],
          errors: [error.message || `Batch ${batchNumber} failed`],
        });
      }
    }

    // Aggregate results
    const aggregated: AggregatedResult = {
      totalRows: 0,
      totalInserted: 0,
      totalDuplicates: 0,
      totalErrors: 0,
      duplicateCodes: [],
      errorMessages: [],
      duration: Date.now() - startTime,
    };

    for (const result of results) {
      aggregated.totalRows += result.total_received;
      aggregated.totalInserted += result.inserted;
      aggregated.totalDuplicates += result.duplicates;
      aggregated.totalErrors += result.errors.length;
      aggregated.duplicateCodes.push(...result.duplicate_codes);
      aggregated.errorMessages.push(...result.errors);
    }

    setUploadResult(aggregated);
    setState(prev => ({ ...prev, isUploading: false, progress: 100 }));
  };

  const handleDownloadTemplate = () => {
    const csvContent = 'voucher_code,discount_percent,expiry_date\nSAVE10,10.00,2025-12-31\nSAVE20,20.00,2026-01-15';
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'voucher_template.csv';
    link.click();
    window.URL.revokeObjectURL(url);
  };

  // Define columns for preview table
  const columns = [
    {
      key: 'voucher_code',
      header: 'Voucher Code',
      sortable: false,
      render: (item: VoucherRow) => (
        <span className="font-mono font-semibold">{item.voucher_code}</span>
      ),
    },
    {
      key: 'discount_percent',
      header: 'Discount',
      sortable: false,
      render: (item: VoucherRow) => `${item.discount_percent}%`,
    },
    {
      key: 'expiry_date',
      header: 'Expiry Date',
      sortable: false,
    },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/vouchers')}
          className="flex items-center gap-2 text-text-secondary hover:text-text-primary mb-4 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Vouchers</span>
        </button>
        <h1 className="text-3xl font-bold text-text-primary">Upload Vouchers via CSV</h1>
        <p className="text-text-secondary mt-2">
          Upload multiple vouchers at once using a CSV file (batch processing for large files)
        </p>
      </div>

      {/* Upload Result */}
      {uploadResult && (
        <div className="bg-surface border border-border rounded-xl p-6 mb-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Upload Complete</h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm text-text-secondary mb-1">Total Rows</p>
              <p className="text-2xl font-bold text-text-primary">{uploadResult.totalRows}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-text-secondary mb-1">Successfully Inserted</p>
              <p className="text-2xl font-bold text-green-600">{uploadResult.totalInserted}</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-sm text-text-secondary mb-1">Duplicates Skipped</p>
              <p className="text-2xl font-bold text-yellow-600">{uploadResult.totalDuplicates}</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-sm text-text-secondary mb-1">Errors</p>
              <p className="text-2xl font-bold text-red-600">{uploadResult.totalErrors}</p>
            </div>
          </div>

          <p className="text-sm text-text-secondary mb-4">
            Completed in {(uploadResult.duration / 1000).toFixed(2)}s
          </p>

          {/* Show duplicate codes */}
          {uploadResult.duplicateCodes.length > 0 && (
            <div className="mb-4">
              <Alert
                variant="warning"
                title="Duplicate Voucher Codes"
                description={
                  <div>
                    <p className="mb-2">The following codes were skipped (already exist):</p>
                    <div className="max-h-40 overflow-y-auto flex flex-wrap gap-2">
                      {uploadResult.duplicateCodes.map((code, index) => (
                        <span key={index} className="inline-flex items-center px-2 py-1 rounded bg-yellow-100 text-yellow-800 text-xs font-mono">
                          {code}
                        </span>
                      ))}
                    </div>
                  </div>
                }
              />
            </div>
          )}

          {/* Show errors */}
          {uploadResult.errorMessages.length > 0 && (
            <div className="mb-4">
              <Alert
                variant="error"
                title="Validation Errors"
                description={
                  <div className="max-h-40 overflow-y-auto">
                    <ul className="list-disc list-inside space-y-1">
                      {uploadResult.errorMessages.map((error, index) => (
                        <li key={index} className="text-sm">{error}</li>
                      ))}
                    </ul>
                  </div>
                }
              />
            </div>
          )}

          <div className="flex justify-end">
            <Button
              variant="primary"
              onClick={() => navigate('/vouchers')}
            >
              Back to Vouchers
            </Button>
          </div>
        </div>
      )}

      {/* Step 1: Download Template */}
      {!uploadResult && (
        <>
          <div className="bg-surface border border-border rounded-xl p-6 mb-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                  Step 1: Download Template (Optional)
                </h3>
                <p className="text-sm text-text-secondary mb-4">
                  Download our CSV template to ensure your file is formatted correctly
                </p>
              </div>
              <Button
                variant="secondary"
                size="small"
                onClick={handleDownloadTemplate}
              >
                <Download className="w-4 h-4 mr-2" />
                Download Template
              </Button>
            </div>
          </div>

          {/* Step 2: Upload CSV File */}
          <div className="bg-surface border border-border rounded-xl p-6 mb-6">
            <h3 className="text-lg font-semibold text-text-primary mb-4">
              Step 2: Select CSV File
            </h3>
            <Upload
              accept=".csv"
              maxSize={10}
              onFileSelect={handleFileSelect}
              helperText="CSV file (max. 10MB)"
              error={parseError}
              // disabled={state.isUploading}
            />
            {state.file && !parseError && (
              <div className="mt-4 p-4 bg-success-soft border border-success rounded-lg">
                <p className="text-sm text-success">
                  <strong>Selected file:</strong> {state.file.name} ({(state.file.size / 1024).toFixed(2)} KB)
                </p>
                <p className="text-sm text-success mt-1">
                  <strong>Total rows:</strong> {state.totalRows} | <strong>Will be sent in:</strong> {state.totalBatches} batch{state.totalBatches > 1 ? 'es' : ''}
                </p>
              </div>
            )}
          </div>

          {/* Step 3: Preview Data */}
          {state.previewData.length > 0 && (
            <div className="bg-surface border border-border rounded-xl p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-text-primary">
                  Step 3: Preview Data
                </h3>
                <p className="text-sm text-text-secondary">
                  Showing first 10 of {state.totalRows} rows
                </p>
              </div>

              <DataTable
                data={state.previewData}
                columns={columns}
                searchable={false}
              />
            </div>
          )}

          {/* Upload Progress */}
          {state.isUploading && (
            <div className="bg-surface border border-border rounded-xl p-6 mb-6">
              <h3 className="text-lg font-semibold text-text-primary mb-4">
                Uploading Vouchers...
              </h3>
              <ProgressBar
                value={state.progress}
                variant="primary"
                size="md"
                showLabel
                label={`Uploading Batch ${state.currentBatch} of ${state.totalBatches}`}
                striped
                animated
              />
              <p className="text-sm text-text-secondary mt-2 text-center">
                Please wait while we process your vouchers in batches (max 1000 per batch)
              </p>
            </div>
          )}

          {/* CSV Format Requirements */}
          {state.previewData.length === 0 && (
            <div className="bg-surface border border-border rounded-xl p-6 mb-6">
              <h3 className="text-lg font-semibold text-text-primary mb-4">
                CSV Format Requirements
              </h3>
              <div className="space-y-3 text-sm text-text-secondary">
                <div>
                  <strong className="text-text-primary">Required Columns:</strong>
                  <ul className="list-disc list-inside ml-4 mt-1">
                    <li><code className="bg-muted px-2 py-1 rounded">voucher_code</code> - Voucher code (unique, alphanumeric)</li>
                    <li><code className="bg-muted px-2 py-1 rounded">discount_percent</code> - Discount value (1-100)</li>
                    <li><code className="bg-muted px-2 py-1 rounded">expiry_date</code> - Expiration date (YYYY-MM-DD format)</li>
                  </ul>
                </div>
                <div>
                  <strong className="text-text-primary">Example:</strong>
                  <pre className="bg-muted p-3 rounded-lg mt-2 overflow-x-auto">
{`voucher_code,discount_percent,expiry_date
SAVE10,10.00,2025-12-31
SAVE20,20.00,2026-01-15`}
                  </pre>
                </div>
                <div>
                  <strong className="text-text-primary">Features:</strong>
                  <ul className="list-disc list-inside ml-4 mt-1">
                    <li>Automatic batch processing for files with more than 1000 rows</li>
                    <li>Duplicate detection (skips existing voucher codes)</li>
                    <li>Progress tracking for large uploads</li>
                    <li>Detailed error reporting</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button
              variant="secondary"
              onClick={() => navigate('/vouchers')}
              disabled={state.isUploading}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={uploadBatches}
              disabled={!state.file || !!parseError || state.isUploading || state.totalRows === 0}
            >
              <UploadIcon className="w-4 h-4 mr-2" />
              {state.isUploading ? 'Uploading...' : 'Upload Vouchers'}
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default CSVUpload;
