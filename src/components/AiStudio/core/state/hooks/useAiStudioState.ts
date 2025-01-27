import { useState } from 'react'
import { LLM_MODELS, type LLMModel } from '../../ai/components/ModelSelector'
import { useScope } from '@/hooks/useScope'
import { useTabState } from './useTabState'
import { useErrorHandler } from '../../error/hooks/useErrorHandler'
import { useActionHandler } from '../../../features/QuickActions/hooks/useActionHandler'
import type { AiStudioState, AiStudioStateProps } from '../types'

export const useAiStudioState = ({ editor }: AiStudioStateProps): AiStudioState => {
  const [selectedModel, setSelectedModel] = useState<LLMModel>(LLM_MODELS[0])
  const [temperature, setTemperature] = useState(0.5)
  const scope = useScope(editor)
  const { activeTab, handleTabChange } = useTabState()
  const errorHandler = useErrorHandler()
  const { showErrorToast, errorMessage, setShowErrorToast } = errorHandler
  const { processingAction, handleActionSelect } = useActionHandler({
    editor,
    scope: scope.scope,
    resetScope: scope.resetScope,
    modelName: selectedModel.id,
    temperature,
    errorHandler,
  })

  return {
    selectedModel,
    setSelectedModel,
    temperature,
    setTemperature,
    scope,
    activeTab,
    handleTabChange,
    processingAction,
    handleActionSelect,
    showErrorToast,
    errorMessage,
    setShowErrorToast,
  }
}
