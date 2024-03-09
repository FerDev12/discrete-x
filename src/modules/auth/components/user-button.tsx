'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useClerk, useUser } from '@clerk/nextjs';
import { LogOutIcon, Settings, UserIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function UserButton() {
  const router = useRouter();
  const { user } = useUser();
  const { signOut } = useClerk();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>
          <Avatar>
            <AvatarImage src={user?.imageUrl} alt='user' />
            <AvatarFallback>
              <UserIcon className='w-4 h-4' />
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel className='flex items-center space-x-2'>
          <Avatar>
            <AvatarImage src={user?.imageUrl} alt='user' />
            <AvatarFallback>
              <UserIcon className='w-4 h-4' />
            </AvatarFallback>
          </Avatar>
          <span className='text-medium'>{user?.username}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className='group'>
            <Settings className='w-4 h-4 mr-2 text-muted-foreground group-hover:text-foreground' />{' '}
            Manage account
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => signOut(() => router.push('/login'))}
            className='text-destructive'
          >
            <LogOutIcon className='w-4 h-4 mr-2' /> Logout
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
