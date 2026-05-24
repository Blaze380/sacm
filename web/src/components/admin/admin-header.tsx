'use client'

import Link from 'next/link'
import { Fragment } from 'react'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'

type Crumb = { label: string; href?: string }

export function AdminHeader({
  title,
  crumbs,
  action,
}: {
  title: string
  crumbs: Crumb[]
  action?: React.ReactNode
}) {
  return (
    <header className="flex flex-col gap-3 border-b px-4 py-3">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        <Separator orientation="vertical" className="mr-1 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            {crumbs.map((crumb, index) => (
              <Fragment key={`${crumb.label}-${index}`}>
                {index > 0 && <BreadcrumbSeparator />}
                <BreadcrumbItem>
                  {crumb.href ? (
                    <BreadcrumbLink asChild>
                      <Link href={crumb.href}>{crumb.label}</Link>
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                  )}
                </BreadcrumbItem>
              </Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-lg font-medium">{title}</h1>
        {action}
      </div>
    </header>
  )
}
