import { UserRound } from 'lucide-react';
import md5 from 'md5';
import type { ComponentPropsWithoutRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';

type GravatarProps = {
  email: string;
  size?: number;
} & Omit<ComponentPropsWithoutRef<typeof AvatarImage>, 'src' | 'alt'>;

// This component should be deleted
const Gravatar = ({ email, size = 40, ...props }: GravatarProps) => {
  const hash = md5(email.trim().toLowerCase());
  const gravatarUrl = `https://www.gravatar.com/avatar/${hash}?s=${String(size)}&d=404`;

  return (
    <Avatar>
      <AvatarImage src={gravatarUrl} alt={email} {...props} />
      <AvatarFallback>
        <UserRound />
      </AvatarFallback>
    </Avatar>
  );
};

export default Gravatar;
