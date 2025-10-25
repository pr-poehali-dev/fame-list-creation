import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface PasswordDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const ADMIN_PASSWORD = 'admin123';

const PasswordDialog = ({ isOpen, onClose, onSuccess }: PasswordDialogProps) => {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      if (password === ADMIN_PASSWORD) {
        onSuccess();
        setPassword('');
        toast({
          title: 'Успех!',
          description: 'Вход выполнен',
        });
      } else {
        toast({
          title: 'Ошибка',
          description: 'Неверный пароль',
          variant: 'destructive'
        });
      }
      setLoading(false);
    }, 500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card/95 backdrop-blur-xl neon-border border-2">
        <DialogHeader>
          <DialogTitle className="font-orbitron text-2xl neon-glow text-primary flex items-center gap-2">
            <Icon name="Lock" size={24} />
            Админ-панель
          </DialogTitle>
          <DialogDescription className="font-roboto text-muted-foreground">
            Введите пароль для доступа к админке
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password" className="font-orbitron text-foreground">
              Пароль
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Введите пароль"
              className="neon-border bg-input text-foreground"
              required
              autoFocus
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/80 font-orbitron neon-border"
          >
            {loading ? (
              <>
                <Icon name="Loader2" className="mr-2 animate-spin" size={20} />
                Проверка...
              </>
            ) : (
              <>
                <Icon name="LogIn" className="mr-2" size={20} />
                Войти
              </>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PasswordDialog;
