import { useEffect, useMemo, useState } from 'react';
import './ReportsPage.css';
import {
  FlowComparisonsReportOverView,
  ApiCompositeKey,
} from '../../../models/reportModel';
import {
  mapDiffChainsToSamples,
  generateSimpleSummary,
  DiffSample,
  DetailedDiffNodeData,
  generateDetailedSummary,
} from '../../../utils/helpers';
import { DropdownButton, Table } from '../../UI';
import { Row } from '@tanstack/react-table';
import {
  detailedDiffTableColumns,
  generateDetailedDiffTableData,
  type DetailedDiffTableData,
  simpleDiffTableColumns,
  generateIgnoredDiffTableData,
  ignoredDiffTableColumns,
} from './makeData';
import { safeJSONParse } from '../../../utils/helpers';
import { NoDocumentIcon } from '../../../fa-icons';
import { ResponseComparisonModal } from '../../Modals';
import { useLocalStorage } from '../../../hooks';
import ServiceAPISummary from '../../Modals/ServiceAPISummaryModal/ServiceAPISummaryModal';
import { ButtonMenu } from '../../UI/DropDownButton/DropdownButton';

/**
 *
 */
const teamSummaryViewer = (
  data: { [serviceName: string]: ApiCompositeKey[] },
  key: string,
  setter: (payload: ApiCompositeKey[], service: string) => void
) => {
  return Object.keys(data).map((service: string) => {
    const count = data[service].length;
    return (
      <div
        className="flex justify-between hover:cursor-pointer"
        key={`${key}-${service}`}
        onClick={() => setter(data[service], service)}
      >
        <span>{service}</span>
        <span>{count}</span>
      </div>
    );
  });
};

/**
 *  ReportsPage Component
 */
const ReportsPage = () => {
  const [viewIdx, setViewIdx] = useState(0);
  const [isResponseComparisonModalOpen, setIsResponseComparisonModalOpen] =
    useState(false);
  const [diffSample, setDiffSample] = useState<DiffSample>();
  const [diffNodeData, setDiffNodeData] = useState<DetailedDiffNodeData>();
  const [highlightedDiffKey, setHighlightedDiffKey] = useState<string>();
  const [selectedServiceInfo, setSelectedServiceInfo] = useState<
    ApiCompositeKey[] | null
  >(null);
  const [selectedServiceName, setSelectedServiceName] = useState<string>('');
  const { getItem } = useLocalStorage();

  /**
   * Toggle Between Table Views
   */
  const viewChangeHandler = (element: ButtonMenu) => {
    const id = element.id.split('-')[1];
    if (id) setViewIdx(parseInt(id));
  };

  const getReportData: FlowComparisonsReportOverView = useMemo(
    () => safeJSONParse(getItem('reportData')),
    [getItem]
  );

  /**
   *
   */
  const handleSelectedServiceInfo = (
    data: ApiCompositeKey[] | null,
    service: string
  ) => {
    setSelectedServiceName(service);
    setSelectedServiceInfo(data);
  };

  const teamEnvSummaryReport = useMemo(
    () => getReportData.teamEnvSummaryReport || {},
    [getReportData]
  );

  const flowComparisonList = useMemo(
    () => getReportData?.flowComparisonList || [],
    [getReportData]
  );

  const simpleTableData = useMemo(
    () => generateSimpleSummary(flowComparisonList),
    [flowComparisonList]
  );
  const simpleTableColumns = useMemo(() => simpleDiffTableColumns, []);
  const detailedTableData = useMemo(
    () => generateDetailedDiffTableData(flowComparisonList),
    [flowComparisonList]
  );
  const detailedTableColumns = useMemo(() => detailedDiffTableColumns, []);

  const ignoredTableData = useMemo(
    () => generateIgnoredDiffTableData(flowComparisonList),
    [flowComparisonList]
  );
  const ignoredTableColumns = useMemo(() => ignoredDiffTableColumns, []);

  useEffect(() => {
    diffSample && setIsResponseComparisonModalOpen(true);
  }, [diffSample]);

  /**
   * Table Row Click Handler
   */
  const tableRowClickHandler = (row: Row<DetailedDiffTableData>) => {
    let rowCopy = row,
      nodeId = row.original.nodeId,
      diffKey = row.original.valueKey,
      flowName = row.original.flowName;
    while ((!nodeId || !flowName) && rowCopy.depth) {
      rowCopy = rowCopy.getParentRow() ?? rowCopy;
      nodeId = nodeId || rowCopy.original.nodeId;
      flowName = flowName || rowCopy.original.flowName;
      diffKey = diffKey || rowCopy.original.valueKey;
    }
    const apiResponseDiffChains = getReportData.apiResponseDiffChains;
    if (!nodeId || !apiResponseDiffChains) return;
    const nodeDiffData = mapDiffChainsToSamples(apiResponseDiffChains)[nodeId];
    if (nodeDiffData.currentSample && nodeDiffData.expectedSample) {
      setHighlightedDiffKey(diffKey);
      setDiffSample(nodeDiffData);
      setDiffNodeData(
        generateDetailedSummary(flowComparisonList)[
          nodeDiffData.currentSample.rawUri
        ][flowName][nodeId]
      );
    }
  };

  const viewTables = [
    <Table
      data={simpleTableData}
      columns={simpleTableColumns}
      rowClickHandler={tableRowClickHandler}
      enableSorting
      enableHiding
      hiddenColumnsLocalStorageKey="hiddenColumns"
      striped
      hasHoverEffect
    />,
    <Table
      data={detailedTableData}
      columns={detailedTableColumns}
      rowClickHandler={tableRowClickHandler}
      bordered
    />,
    <Table
      data={ignoredTableData}
      columns={ignoredTableColumns}
      rowClickHandler={tableRowClickHandler}
      bordered
    />,
  ];

  return flowComparisonList.length ? (
    <div>
      <div className="m-4 mt-0 mr-8 flex flex-col gap-4">
        <h3 className="text-base font-bold text-gray-900">Samples Overview</h3>
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="overflow-hidden rounded-lg bg-white p-4 shadow">
            <dt className="truncate text-sm font-medium text-gray-500">
              Total Tested Samples
            </dt>
            <dd className="mt-1 text-4xl font-bold text-blue-600">
              {getReportData.totalSamplesTested}
            </dd>
          </div>
          <div className="overflow-hidden rounded-lg bg-white p-4 shadow">
            <dt className="truncate text-sm font-medium text-gray-500">
              Total Passed Samples
            </dt>
            <dd className="mt-1 text-4xl font-bold text-green-600">
              {getReportData.totalSamplesPassed}
            </dd>
          </div>
          <div className="overflow-hidden rounded-lg bg-white p-4 shadow">
            <dt className="truncate text-sm font-medium text-gray-500">
              Total Failures
            </dt>
            <dd className="mt-1 text-4xl font-bold text-red-600">
              {getReportData.realFailure}
            </dd>
          </div>
        </dl>
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <div className="overflow-hidden rounded-lg bg-white p-4 shadow">
            <dt className="truncate text-sm font-medium text-gray-500">
              Services VS Total APIs Tested
            </dt>
            <dd className="mt-1 text-sm font-bold text-blue-600">
              {!!Object.keys(teamEnvSummaryReport.serviceVsTotalApisTested)
                .length &&
                teamSummaryViewer(
                  teamEnvSummaryReport.serviceVsTotalApisTested,
                  'serviceVsTotalApisTested',
                  handleSelectedServiceInfo
                )}
            </dd>
          </div>
          <div className="overflow-hidden rounded-lg bg-white p-4 shadow">
            <dt className="truncate text-sm font-medium text-gray-500">
              Services VS Total APIs Passed
            </dt>
            <dd className="mt-1 text-sm font-bold text-green-600">
              {!!Object.keys(teamEnvSummaryReport.serviceVsTotalApisPassed)
                .length &&
                teamSummaryViewer(
                  teamEnvSummaryReport.serviceVsTotalApisPassed,
                  'serviceVsTotalApisPassed',
                  handleSelectedServiceInfo
                )}
            </dd>
          </div>
          <div className="overflow-hidden rounded-lg bg-white p-4 shadow">
            <dt className="truncate text-sm font-medium text-gray-500">
              Services VS Total APIs Failed
            </dt>
            <dd className="mt-1 text-sm font-bold text-red-600">
              {!!Object.keys(teamEnvSummaryReport.serviceVsTotalApisFailed)
                .length &&
                teamSummaryViewer(
                  teamEnvSummaryReport.serviceVsTotalApisFailed,
                  'serviceVsTotalApisFailed',
                  handleSelectedServiceInfo
                )}
            </dd>
          </div>
          <div className="overflow-hidden rounded-lg bg-white p-4 shadow">
            <dt className="truncate text-sm font-medium text-gray-500">
              Services VS Total APIs Not Tested
            </dt>
            <dd className="mt-1 text-sm font-bold text-yellow-600">
              {!!Object.keys(teamEnvSummaryReport.serviceVsTotalApisNotTested)
                .length &&
                teamSummaryViewer(
                  teamEnvSummaryReport.serviceVsTotalApisNotTested,
                  'serviceVsTotalApisNotTested',
                  handleSelectedServiceInfo
                )}
            </dd>
          </div>
        </dl>
        <div className="w-2/12">
          <DropdownButton
            buttonText={'Change View'}
            onItemClick={viewChangeHandler}
            buttonMenu={[
              { id: `reportView-0`, label: 'View 1' },
              { id: `reportView-1`, label: 'View 2' },
              { id: `reportView-2`, label: 'View 3' },
            ]}
          />
        </div>
      </div>
      {viewTables[viewIdx]}
      <ResponseComparisonModal
        isOpen={isResponseComparisonModalOpen}
        setIsOpen={setIsResponseComparisonModalOpen}
        expectedSample={diffSample?.expectedSample || null}
        currentSample={diffSample?.currentSample || null}
        highlightedDiffKey={highlightedDiffKey}
        diffNodeData={diffNodeData}
      />
      <ServiceAPISummary
        isOpen={Boolean(selectedServiceInfo?.length)}
        setIsOpen={() => handleSelectedServiceInfo(null, '')}
        serviceSummary={selectedServiceInfo}
        serviceName={selectedServiceName}
      />
    </div>
  ) : (
    <div className="h-full flex flex-col gap-3 items-center justify-center text-3xl font-semibold">
      <span className="text-7xl text-blue-600">
        <NoDocumentIcon />
      </span>
      No Reports Found
    </div>
  );
};

export default ReportsPage;
