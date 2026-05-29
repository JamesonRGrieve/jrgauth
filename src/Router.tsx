'use client';

import { notFound, useSearchParams } from 'next/navigation';
import type { ReactNode } from 'react';
import { AuthenticationContext } from './AuthenticationContext';
import ErrorPage, { type ErrorPageProps } from './ErrorPage';
import User, { type IdentifyProps } from './Identify';
import Login, { type LoginProps } from './Login';
import Logout, { type LogoutProps } from './Logout';
import OrganizationalUnit, { type OrganizationalUnitProps } from './OU';
import Register, { type RegisterProps } from './Register';
import Subscribe, { type SubscribeProps } from './Subscribe';
import deepMerge from './lib/objects';
import Manage, { type ManageProps } from './management';
import Close, { type CloseProps } from './oauth2/Close';
import oAuth2Providers from './oauth2/OAuthProviders';

export { useAuthentication } from './useAuthentication';

type RouterPageProps = {
  path: string;
  heading?: string;
};

export type AuthenticationConfig = {
  identify: RouterPageProps & { props?: IdentifyProps };
  login: RouterPageProps & { props?: LoginProps };
  manage: RouterPageProps & { props?: ManageProps };
  register: RouterPageProps & { props?: RegisterProps };
  close: RouterPageProps & { props?: CloseProps };
  subscribe: RouterPageProps & { props?: SubscribeProps };
  logout: RouterPageProps & { props?: LogoutProps };
  ou: RouterPageProps & { props?: OrganizationalUnitProps };
  error: RouterPageProps & { props?: ErrorPageProps };
  authModes: {
    basic: boolean;
    oauth2: boolean;
    magical: boolean;
  };
  authServer: string;
  appName: string;
  authBaseURI: string;
  recaptchaSiteKey?: string;
  enableOU: boolean;
};

const pageConfigDefaults: AuthenticationConfig = {
  identify: {
    path: '/',
    heading: 'Welcome',
  },
  login: {
    path: '/login',
    heading: 'Please Authenticate',
  },
  manage: {
    path: '/manage',
    heading: 'Account Management',
  },
  register: {
    path: '/register',
    heading: 'Welcome, Please Register',
  },
  close: {
    path: '/close',
    heading: '',
  },
  subscribe: {
    path: '/subscribe',
    heading: 'Please Subscribe to Access The Application',
  },
  ou: {
    path: '/ou',
    heading: 'Organizational Unit Management',
  },
  logout: {
    path: '/logout',
    props: undefined,
    heading: '',
  },
  error: {
    path: '/error',
    heading: 'Error',
  },
  appName: process.env.NEXT_PUBLIC_APP_NAME ?? '',
  authBaseURI: process.env.NEXT_PUBLIC_AUTH_URI ?? '',
  authServer: process.env.NEXT_PUBLIC_API_URI ?? '',
  authModes: {
    basic: true,
    oauth2: Object.values(oAuth2Providers).some((provider) => (provider.client_id ?? '') !== ''),
    magical: false,
  },
  recaptchaSiteKey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
  enableOU: false,
};

export default function AuthRouter({
  params,
  searchParams,
  corePagesConfig = pageConfigDefaults,
  additionalPages = {},
}: {
  params: { slug?: string[] };
  searchParams?: Record<string, string> | URLSearchParams;
  corePagesConfig?: Partial<AuthenticationConfig>;
  additionalPages?: { [key: string]: ReactNode };
}): ReactNode {
  // Use Next.js 15 hooks for search params if not provided directly
  const routeSearchParams = useSearchParams();

  // Convert searchParams to a regular object
  const searchParamsObject: Record<string, string> = {};

  const paramsToUse = searchParams instanceof URLSearchParams ? searchParams : routeSearchParams;
  paramsToUse.forEach((value, key) => {
    searchParamsObject[key] = value;
  });
  if (searchParams !== undefined && !(searchParams instanceof URLSearchParams)) {
    Object.assign(searchParamsObject, searchParams);
  }

  console.warn('AuthRouter searchParams:', searchParamsObject);
  console.warn('AuthRouter params:', params);

  // Merge configs - ensure deep merge works with partial config
  const mergedConfig = deepMerge(pageConfigDefaults, corePagesConfig) as AuthenticationConfig;

  // Define pages with components
  const pages = {
    [mergedConfig.identify.path]: <User {...mergedConfig.identify.props} />,
    [mergedConfig.login.path]: <Login searchParams={searchParamsObject} {...mergedConfig.login.props} />,
    [mergedConfig.manage.path]: <Manage {...mergedConfig.manage.props} />,
    [mergedConfig.register.path]: <Register searchParams={searchParamsObject} {...mergedConfig.register.props} />,
    [mergedConfig.close.path]: <Close searchParams={searchParamsObject} {...mergedConfig.close.props} />,
    [mergedConfig.subscribe.path]: <Subscribe searchParams={searchParamsObject} {...mergedConfig.subscribe.props} />,
    [mergedConfig.logout.path]: <Logout searchParams={searchParamsObject} {...mergedConfig.logout.props} />,
    ...(mergedConfig.enableOU
      ? { [mergedConfig.ou.path]: <OrganizationalUnit searchParams={searchParamsObject} {...mergedConfig.ou.props} /> }
      : {}),
    [mergedConfig.error.path]: <ErrorPage searchParams={searchParamsObject} {...mergedConfig.error.props} />,
    ...additionalPages,
  };

  // Determine current path from slug
  let path = '/';

  // Safely handle slug arrays, ensuring we don't directly access properties
  // that might be undefined or pending promises
  if ('slug' in params) {
    const slug = params.slug;
    if (Array.isArray(slug) && slug.length > 0) {
      path = `/${slug.join('/')}`;
    }
  }

  console.warn('Raw path from params:', path);
  console.warn('Parsed params:', params);

  // Special handling for register path
  if (path === '/register' || path.endsWith('/register')) {
    path = mergedConfig.register.path;
  }

  console.warn('Final path to render:', path);
  console.warn('Available paths in router:', Object.keys(pages));

  // Render appropriate component based on path
  if (path in pages || path.startsWith(mergedConfig.close.path)) {
    console.warn('Rendering component for path:', path);
    return (
      <AuthenticationContext.Provider value={mergedConfig}>
        {path.startsWith(mergedConfig.close.path) ? pages[mergedConfig.close.path] : pages[path]}
      </AuthenticationContext.Provider>
    );
  } else {
    console.warn('Path not found in pages, returning 404. Path:', path);
    console.warn('Available paths:', Object.keys(pages));
    return notFound();
  }
}
