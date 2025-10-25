import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface ComplaintFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const ComplaintForm = ({ isOpen, onClose }: ComplaintFormProps) => {
  const [telegram, setTelegram] = useState('');
  const [targetUser, setTargetUser] = useState('');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('https://functions.poehali.dev/aecf8999-fe28-4e6a-9d4e-e6e487707238', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          telegram,
          targetUser,
          reason
        })
      });

      if (response.ok) {
        setSubmitted(true);
        setTimeout(() => {
          setSubmitted(false);
          setTelegram('');
          setTargetUser('');
          setReason('');
          onClose();
        }, 2000);
      }
    } catch (error) {
      console.error('Error submitting complaint:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <Card className="w-full max-w-lg p-6 neon-border relative animate-scale-in">
        <Button
          onClick={onClose}
          variant="ghost"
          size="sm"
          className="absolute top-4 right-4 hover:bg-primary/20"
        >
          <Icon name="X" size={20} />
        </Button>

        {submitted ? (
          <div className="text-center py-8">
            <Icon name="CheckCircle" size={64} className="mx-auto mb-4 text-neon-cyan" />
            <h2 className="text-2xl font-orbitron text-primary mb-2">Жалоба отправлена!</h2>
            <p className="text-muted-foreground">Администратор рассмотрит вашу заявку</p>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-orbitron text-primary mb-1 neon-glow">Оспорить решение</h2>
            <p className="text-sm text-muted-foreground mb-6">Заполните форму для подачи жалобы</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-roboto text-foreground mb-2">
                  1. Ваш Telegram username
                </label>
                <input
                  type="text"
                  value={telegram}
                  onChange={(e) => setTelegram(e.target.value)}
                  placeholder="@username"
                  required
                  className="w-full px-4 py-2 rounded-lg bg-background border border-border/50 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-roboto"
                />
              </div>

              <div>
                <label className="block text-sm font-roboto text-foreground mb-2">
                  2. С кем не согласны (username)
                </label>
                <input
                  type="text"
                  value={targetUser}
                  onChange={(e) => setTargetUser(e.target.value)}
                  placeholder="@username"
                  required
                  className="w-full px-4 py-2 rounded-lg bg-background border border-border/50 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-roboto"
                />
              </div>

              <div>
                <label className="block text-sm font-roboto text-foreground mb-2">
                  3. Почему не согласны
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Опишите причину вашего несогласия..."
                  required
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg bg-background border border-border/50 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-roboto resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-gradient-to-r from-secondary to-accent hover:from-secondary/80 hover:to-accent/80 neon-border font-orbitron"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Отправка...
                    </>
                  ) : (
                    <>
                      <Icon name="Send" className="mr-2" size={18} />
                      Отправить жалобу
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  onClick={onClose}
                  variant="outline"
                  className="hover:bg-primary/20"
                >
                  Отмена
                </Button>
              </div>
            </form>
          </>
        )}
      </Card>
    </div>
  );
};

export default ComplaintForm;