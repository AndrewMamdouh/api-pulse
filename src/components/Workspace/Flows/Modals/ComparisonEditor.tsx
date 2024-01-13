import {
  ComparisonConfig,
  ComparisonType,
  KeyValuePair,
} from '../../../../models/reportModel';
import ComparisonTabGroup from '../../../Tab-Groups/ComparisonTabGroup';
import { useDispatch } from 'react-redux';
import {
  updateComparisonEditor,
  ModalState,
  ComparisonEditModal,
} from '../../../../slices/flowSlice';
import { getArrayUniqueValue } from '../../../../utils/helpers';

type ComparisonEditorProps = {
  comparisonEditorState: ModalState<ComparisonEditModal>;
  isEditable?: boolean;
};

/**
 * ComparisonEditor Component
 */
const ComparisonEditor = ({
  comparisonEditorState,
  isEditable = true,
}: ComparisonEditorProps) => {
  const dispatch = useDispatch();

  if (!comparisonEditorState.visible) return null;

  /**
   * Update Comparison Modal State
   */
  const handleComparisonStateChange = (
    newComparisonState: Partial<ComparisonConfig>,
    type: ComparisonType
  ) => {
    if (!isEditable) return;

    if (!comparisonEditorState.request.id) {
      throw Error("Can't find id property of the selected node");
    }

    const matchedComparisonTypeIdx =
      comparisonEditorState.request.comparisonConfigs?.findIndex(
        (config) => config.type === type
      );
    let normalizeComparisonState: ComparisonConfig;

    if (matchedComparisonTypeIdx === -1 || isNaN(matchedComparisonTypeIdx)) {
      normalizeComparisonState = {
        ignoredKeys: [],
        overRidingKeyValues: [],
        ...newComparisonState,
        type,
      };
    } else {
      normalizeComparisonState = {
        ...comparisonEditorState.request.comparisonConfigs[
          matchedComparisonTypeIdx
        ],
        ...newComparisonState,
      };
    }

    dispatch(
      updateComparisonEditor({
        comparisonConfig: normalizeComparisonState,
        id: comparisonEditorState.request.id,
      })
    );
  };

  return (
    <div className="min-w-[460px]">
      <div className="flex flex-col">
        {Object.values(ComparisonType).map((type) => (
          <ComparisonTabGroup
            key={type}
            title={type}
            ignoredKeys={
              comparisonEditorState.request.comparisonConfigs?.find(
                (config) => config.type === type
              )?.ignoredKeys || []
            }
            setIgnoredKeys={(ignoredKeys: string[]) =>
              handleComparisonStateChange(
                { ignoredKeys: getArrayUniqueValue(ignoredKeys) },
                type
              )
            }
            overRidingKeyValues={
              comparisonEditorState.request.comparisonConfigs?.find(
                (config) => config.type === type
              )?.overRidingKeyValues || []
            }
            setOverRidingKeyValues={(overRidingKeyValues: KeyValuePair[]) =>
              handleComparisonStateChange({ overRidingKeyValues }, type)
            }
            isEditable={isEditable}
          />
        ))}
      </div>
    </div>
  );
};

export default ComparisonEditor;
