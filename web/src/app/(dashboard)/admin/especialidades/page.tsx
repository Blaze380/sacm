'use client'

import { SimpleNameCrudPage } from '@/components/admin/simple-name-crud-page'
import { createSpecialty } from '@/gen/clients/createSpecialty'
import { deleteSpecialty } from '@/gen/clients/deleteSpecialty'
import { findSpecialties } from '@/gen/clients/findSpecialties'
import { updateSpecialty } from '@/gen/clients/updateSpecialty'
import { apiClient } from '@/lib/api/client'

export default function EspecialidadesPage() {
  return (
    <SimpleNameCrudPage
      config={{
        title: 'Especialidades',
        singularLabel: 'Especialidade',
        breadcrumbs: [
          { label: 'Admin', href: '/admin/especialidades' },
          { label: 'Especialidades' },
        ],
        listPath: '/admin/especialidades',
        fetchList: async ({ page, limit, search }) => {
          const result = await findSpecialties(
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
          await createSpecialty({ name }, { client: apiClient })
        },
        updateItem: async (id, name) => {
          await updateSpecialty(id, { name }, { client: apiClient })
        },
        deleteItem: async (id) => {
          await deleteSpecialty(id, { client: apiClient })
        },
      }}
    />
  )
}
