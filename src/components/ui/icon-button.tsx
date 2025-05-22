import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';
import { Button, ButtonProps } from './button';
import { cn } from '@/lib/utils';

interface Props extends ButtonProps {
  icon: React.ElementType;
  tooltip?: string;
  className?: string;
}

export function IconButton({ icon: Icon, tooltip, className, ...props }: Props) {
  if (!tooltip)
    return (
      <Button type='button' variant='ghost' size='icon' className={cn('h-8 w-8', className)} {...props}>
        <Icon className='h-4 w-4' />
      </Button>
    );
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button type='button' variant='ghost' size='icon' className={cn('h-8 w-8', className)} {...props}>
            <Icon className='h-4 w-4' />
          </Button>
        </TooltipTrigger>
        <TooltipContent className='bg-secondary'>
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
