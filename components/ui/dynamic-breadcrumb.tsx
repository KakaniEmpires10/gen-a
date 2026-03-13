'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home } from 'lucide-react';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import { Card } from './card';
import React from 'react';

export default function DynamicBreadcrumb() {
    const pathname = usePathname();

    // Split the pathname into segments and create breadcrumb items
    const getPathSegments = () => {
        const segments = pathname
            .split('/')
            .filter(segment => segment !== '');

        const breadcrumbItems = segments.map((segment, index) => {
            // Create the href for this breadcrumb level
            const href = `/${segments.slice(0, index + 1).join('/')}`;

            // Format the segment name (capitalize, replace hyphens with spaces)
            const name = segment
                .split('-')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');

            // Check if this is the current (last) segment
            const isCurrentPage = index === segments.length - 1;

            return {
                name,
                href,
                isCurrentPage
            };
        });

        return breadcrumbItems;
    };

    const pathSegments = getPathSegments();

    return (
        <Card className='py-2 px-4 mx-2 my-2 md:my-4 lg:mx-4'>
            <Breadcrumb>
                <BreadcrumbList>
                    {/* Home icon as first item */}
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/">
                                <Home className="h-3 w-3" />
                            </Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>

                    {/* Only show separator if there are path segments */}
                    {pathSegments.length > 0 && <BreadcrumbSeparator />}

                    {/* Dynamic breadcrumb items based on URL */}
                    {pathSegments.map((segment, index) => (
                        <React.Fragment key={index}>
                            <BreadcrumbItem key={index}>
                                {segment.isCurrentPage ? (
                                    <BreadcrumbPage className='text-xs font-medium'>{segment.name}</BreadcrumbPage>
                                ) : (
                                    <BreadcrumbLink asChild>
                                        <Link href={segment.href} className='text-xs font-medium'>{segment.name}</Link>
                                    </BreadcrumbLink>
                                )}
                            </BreadcrumbItem>
                            {index < pathSegments.length - 1 && <BreadcrumbSeparator />}
                        </React.Fragment>
                    ))}
                </BreadcrumbList>
            </Breadcrumb>
        </Card>
    );
}