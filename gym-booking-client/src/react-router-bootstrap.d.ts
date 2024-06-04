declare module 'react-router-bootstrap' {
  import { ComponentType } from 'react';
  import { LinkProps } from 'react-router-dom';
  import { ButtonProps } from 'react-bootstrap';

  export interface LinkContainerProps extends LinkProps {
    to: LinkProps['to'];
    replace?: boolean;
    children: React.ReactNode;
  }

  export const LinkContainer: ComponentType<LinkContainerProps>;
}
