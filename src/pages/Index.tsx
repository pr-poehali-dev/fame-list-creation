import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import AdminPanel from '@/components/AdminPanel';
import ProfileCard from '@/components/ProfileCard';
import ProfileModal from '@/components/ProfileModal';
import PasswordDialog from '@/components/PasswordDialog';

interface Profile {
  id: number;
  name: string;
  username: string;
  description: string;
  photo_url: string;
  caste: string;
  views: number;
}

const Index = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [showAdmin, setShowAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const loadProfiles = async () => {
    try {
      const response = await fetch('https://functions.poehali.dev/eb6fcdbf-3fd0-41ea-ba77-12004c31e7eb');
      const data = await response.json();
      setProfiles(data.profiles || []);
    } catch (error) {
      console.error('Error loading profiles:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfiles();
  }, []);

  const handleProfileClick = async (profile: Profile) => {
    setSelectedProfile(profile);
    try {
      await fetch(`https://functions.poehali.dev/eb6fcdbf-3fd0-41ea-ba77-12004c31e7eb?id=${profile.id}`, {
        method: 'PUT'
      });
      loadProfiles();
    } catch (error) {
      console.error('Error incrementing view:', error);
    }
  };

  const handleAdminClick = () => {
    if (!isAuthenticated) {
      setShowPasswordDialog(true);
    } else {
      setShowAdmin(!showAdmin);
    }
  };

  const handlePasswordSuccess = () => {
    setIsAuthenticated(true);
    setShowPasswordDialog(false);
    setShowAdmin(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-purple via-neon-cyan to-neon-pink animate-neon-pulse z-50" />
      
      <header className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl md:text-5xl font-orbitron font-bold neon-glow text-primary">
              FAME LIST
            </h1>
            <div className="flex gap-3">
              <Button
                onClick={() => window.open('https://t.me/telorezov', '_blank')}
                className="bg-gradient-to-r from-secondary to-accent hover:from-secondary/80 hover:to-accent/80 neon-border font-orbitron"
                size="lg"
              >
                <Icon name="UserPlus" className="mr-2" size={20} />
                Подать заявку
              </Button>
              <Button
                onClick={handleAdminClick}
                className="bg-primary hover:bg-primary/80 neon-border font-orbitron"
                size="lg"
              >
                <Icon name="Settings" className="mr-2" size={20} />
                {showAdmin ? 'Закрыть' : 'Админка'}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {showAdmin && (
        <div className="container mx-auto px-4 py-8 animate-fade-in">
          <AdminPanel onProfileAdded={loadProfiles} />
        </div>
      )}

      <main className="container mx-auto px-4 py-12">
        <div className="mb-12 text-center">
          <p className="text-muted-foreground text-lg font-roboto">
            <span className="neon-cyan-glow text-secondary">Рейтинг</span> известных личностей
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <Badge variant="outline" className="neon-border text-primary font-orbitron">
              Главный фейм
            </Badge>
            <Badge variant="outline" className="border-secondary text-secondary font-orbitron">
              Фейм
            </Badge>
            <Badge variant="outline" className="border-accent text-accent font-orbitron">
              Средний фейм
            </Badge>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : profiles.length === 0 ? (
          <Card className="p-12 text-center neon-border animate-scale-in">
            <Icon name="Users" className="mx-auto mb-4 text-muted-foreground" size={64} />
            <h3 className="text-xl font-orbitron text-muted-foreground mb-2">
              Пока никого нет
            </h3>
            <p className="text-muted-foreground mb-4">
              Откройте админку и добавьте первую личность
            </p>
            <Button onClick={() => setShowAdmin(true)} className="bg-primary hover:bg-primary/80">
              Открыть админку
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {profiles.map((profile, index) => (
              <div
                key={profile.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <ProfileCard profile={profile} onClick={() => handleProfileClick(profile)} />
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="border-t border-border/50 mt-20 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground font-roboto">
            Fame List <span className="neon-pink-glow">★</span> 2025
          </p>
        </div>
      </footer>

      <ProfileModal
        profile={selectedProfile}
        isOpen={!!selectedProfile}
        onClose={() => setSelectedProfile(null)}
      />

      <PasswordDialog
        isOpen={showPasswordDialog}
        onClose={() => setShowPasswordDialog(false)}
        onSuccess={handlePasswordSuccess}
      />
    </div>
  );
};

export default Index;