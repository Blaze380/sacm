'use client'

import { SimpleNameCrudPage } from '@/components/admin/simple-name-crud-page'
import { createConsultationType } from '@/gen/clients/createConsultationType'
import { deleteConsultationType } from '@/gen/clients/deleteConsultationType'
import { findConsultationTypes } from '@/gen/clients/findConsultationTypes'
import { updateConsultationType } from '@/gen/clients/updateConsultationType'
import { apiClient } from '@/lib/api/client'

export default function TiposConsultaPage() {
  return (
    <SimpleNameCrudPage
      config={{
        title: 'Tipos de consulta',
        singularLabel: 'Tipo de consulta',
        breadcrumbs: [
          { label: 'Admin', href: '/admin/especialidades' },
          { label: 'Tipos de consulta' },
        ],
        listPath: '/admin/tipos-consulta',
        fetchList: async ({ page, limit, search }) => {
          const result = await findConsultationTypes(
            {
              page,
              limit,
              sort: 'name',
              ...(search ? { name: { icontains: search } } : {}),
            },
            { client: apiClient }
          )
          return { data: result.data, total: result.total }
        },
        createItem: async (name) => {
          await createConsultationType({ name }, { client: apiClient })
        },
        updateItem: async (id, name) => {
          await updateConsultationType(id, { name }, { client: apiClient })
        },
        deleteItem: async (id) => {
          await deleteConsultationType(id, { client: apiClient })
        },
      }}
    />
  )
}
