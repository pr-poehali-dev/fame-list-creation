import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface Profile {
  id: number;
  name: string;
  username: string;
  description: string;
  photo_url: string;
  caste: string;
  views: number;
}

interface ProfileModalProps {
  profile: Profile | null;
  isOpen: boolean;
  onClose: () => void;
}

const getCasteBadgeColor = (caste: string) => {
  switch (caste) {
    case 'главный фейм':
      return 'bg-gradient-to-r from-neon-purple to-neon-pink neon-border text-white';
    case 'фейм':
      return 'bg-primary/20 border-primary text-primary neon-border';
    case 'средний фейм':
      return 'bg-secondary/20 border-secondary text-secondary';
    case 'малый фейм':
      return 'bg-accent/20 border-accent text-accent';
    case 'новичок':
      return 'bg-muted border-muted-foreground text-muted-foreground';
    case 'скамер':
      return 'bg-destructive/20 border-destructive text-destructive';
    default:
      return 'bg-muted';
  }
};

const ProfileModal = ({ profile, isOpen, onClose }: ProfileModalProps) => {
  if (!profile) return null;

  const getTelegramUrl = (username: string) => {
    const cleanUsername = username.replace('@', '');
    return `https://t.me/${cleanUsername}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-card/95 backdrop-blur-xl neon-border border-2 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-orbitron text-3xl neon-glow text-primary">
            {profile.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {profile.photo_url && (
            <div className="relative aspect-video rounded-lg overflow-hidden neon-border">
              <img
                src={profile.photo_url}
                alt={profile.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3">
            <Badge className={`${getCasteBadgeColor(profile.caste)} font-orbitron text-sm px-4 py-2`}>
              {profile.caste}
            </Badge>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Icon name="Eye" size={20} />
              <span className="font-roboto font-medium">{profile.views.toLocaleString()} просмотров</span>
            </div>
          </div>

          {profile.username && (
            <div>
              <h3 className="font-orbitron text-sm text-muted-foreground mb-2">Telegram</h3>
              <p className="text-secondary neon-cyan-glow text-lg font-roboto">
                {profile.username}
              </p>
            </div>
          )}

          {profile.description && (
            <div>
              <h3 className="font-orbitron text-sm text-muted-foreground mb-2">Описание</h3>
              <p className="text-foreground font-roboto leading-relaxed whitespace-pre-wrap">
                {profile.description}
              </p>
            </div>
          )}

          {profile.username && (
            <Button
              asChild
              className="w-full bg-gradient-to-r from-secondary to-primary hover:from-secondary/80 hover:to-primary/80 text-white font-orbitron text-lg py-6 neon-border"
            >
              <a
                href={getTelegramUrl(profile.username)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon name="Send" className="mr-2" size={20} />
                Написать в Telegram
              </a>
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileModal;
