import * as React from 'react'
import { useQuery } from 'react-query'

import * as api from '@/services/networking.service'
import { CategoriesSchema, Category } from './api.typings'
import * as transform from './api.transformers'

export const useCategories = () => {
  return useQuery<Category[], unknown>(
    'categories',
    api.get<CategoriesSchema, unknown>('categories'),
    {
      notifyOnChangeProps: ['data', 'error'],
      select: React.useCallback(data => transform.categories(data), []),
    }
  )
}
