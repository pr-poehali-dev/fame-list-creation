import { Card } from '@/components/ui/card';
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

interface ProfileCardProps {
  profile: Profile;
  onClick: () => void;
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

const ProfileCard = ({ profile, onClick }: ProfileCardProps) => {
  return (
    <Card
      className="overflow-hidden neon-border hover:scale-[1.02] transition-all duration-300 cursor-pointer group bg-card/50 backdrop-blur-sm"
      onClick={onClick}
    >
      <div className="relative aspect-square overflow-hidden">
        {profile.photo_url ? (
          <img
            src={profile.photo_url}
            alt={profile.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
            <Icon name="User" size={64} className="text-muted-foreground/30" />
          </div>
        )}
        <div className="absolute top-1 md:top-2 right-1 md:right-2">
          <Badge className={`${getCasteBadgeColor(profile.caste)} font-orbitron text-[8px] md:text-xs px-1.5 md:px-2 py-0.5`}>
            {profile.caste}
          </Badge>
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-1.5 md:p-3">
          <div className="flex items-center gap-1 text-white/90">
            <Icon name="Eye" size={12} className="md:w-4 md:h-4" />
            <span className="font-roboto font-medium text-[10px] md:text-sm">{profile.views.toLocaleString()}</span>
          </div>
        </div>
      </div>
      
      <div className="p-2 md:p-4">
        <h3 className="font-orbitron font-bold text-xs md:text-base mb-0.5 neon-glow text-foreground group-hover:text-primary transition-colors truncate">
          {profile.name}
        </h3>
        {profile.username && (
          <p className="text-secondary neon-cyan-glow text-[10px] md:text-xs font-roboto truncate">
            {profile.username}
          </p>
        )}
      </div>
    </Card>
  );
};

export default ProfileCard;