import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface Profile {
  id: number;
  name: string;
  username: string;
  caste: string;
  views: number;
}

interface AdminPanelProps {
  onProfileAdded: () => void;
}

const CASTES = ['фейм', 'малый фейм', 'средний фейм', 'главный фейм', 'новичок', 'скамер'];

const AdminPanel = ({ onProfileAdded }: AdminPanelProps) => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [description, setDescription] = useState('');
  const [caste, setCaste] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loadingProfiles, setLoadingProfiles] = useState(true);
  const { toast } = useToast();

  const loadProfiles = async () => {
    try {
      const response = await fetch('https://functions.poehali.dev/eb6fcdbf-3fd0-41ea-ba77-12004c31e7eb');
      const data = await response.json();
      setProfiles(data.profiles || []);
    } catch (error) {
      console.error('Error loading profiles:', error);
    } finally {
      setLoadingProfiles(false);
    }
  };

  useEffect(() => {
    loadProfiles();
  }, []);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !caste) {
      toast({
        title: 'Ошибка',
        description: 'Заполните имя и выберите касту',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);

    try {
      let photoUrl = '';
      
      if (photoFile) {
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64 = (reader.result as string).split(',')[1];
          
          const uploadResponse = await fetch('https://functions.poehali.dev/e6f02106-f655-46d8-b388-9a4819ac45c0', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image: base64 })
          });
          
          const uploadData = await uploadResponse.json();
          photoUrl = uploadData.url;

          await saveProfile(photoUrl);
        };
        reader.readAsDataURL(photoFile);
      } else {
        await saveProfile('');
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось добавить профиль',
        variant: 'destructive'
      });
      setLoading(false);
    }
  };

  const saveProfile = async (photoUrl: string) => {
    const response = await fetch('https://functions.poehali.dev/eb6fcdbf-3fd0-41ea-ba77-12004c31e7eb', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        username,
        description,
        photo_url: photoUrl,
        caste
      })
    });

    if (response.ok) {
      toast({
        title: 'Успех!',
        description: 'Профиль добавлен',
      });
      
      setName('');
      setUsername('');
      setDescription('');
      setCaste('');
      setPhotoFile(null);
      setPhotoPreview('');
      loadProfiles();
      onProfileAdded();
    } else {
      throw new Error('Failed to save profile');
    }
    
    setLoading(false);
  };

  const handleDelete = async (profileId: number) => {
    if (!confirm('Удалить эту личность?')) return;

    try {
      const response = await fetch(`https://functions.poehali.dev/eb6fcdbf-3fd0-41ea-ba77-12004c31e7eb?id=${profileId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast({
          title: 'Удалено',
          description: 'Профиль удален',
        });
        loadProfiles();
        onProfileAdded();
      }
    } catch (error) {
      console.error('Error deleting profile:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить профиль',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 md:p-8 neon-border bg-card/80 backdrop-blur-sm animate-scale-in">
        <div className="flex items-center gap-3 mb-6">
          <Icon name="UserPlus" className="text-primary" size={32} />
          <h2 className="text-2xl md:text-3xl font-orbitron font-bold neon-glow text-primary">
            Добавить личность
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="font-orbitron text-foreground">
              Имя *
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Введите имя"
              className="neon-border bg-input text-foreground"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="username" className="font-orbitron text-foreground">
              Юзернейм
            </Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="@username"
              className="neon-border bg-input text-foreground"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="caste" className="font-orbitron text-foreground">
            Каста *
          </Label>
          <Select value={caste} onValueChange={setCaste} required>
            <SelectTrigger className="neon-border bg-input text-foreground">
              <SelectValue placeholder="Выберите касту" />
            </SelectTrigger>
            <SelectContent>
              {CASTES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="font-orbitron text-foreground">
            Описание
          </Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Краткое описание личности"
            className="neon-border bg-input text-foreground min-h-24"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="photo" className="font-orbitron text-foreground">
            Фото
          </Label>
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <Input
                id="photo"
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="neon-border bg-input text-foreground"
              />
            </div>
            {photoPreview && (
              <div className="w-24 h-24 rounded-lg overflow-hidden neon-border">
                <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/80 hover:to-secondary/80 text-white font-orbitron text-lg py-6 neon-border"
        >
          {loading ? (
            <>
              <Icon name="Loader2" className="mr-2 animate-spin" size={20} />
              Загрузка...
            </>
          ) : (
            <>
              <Icon name="Plus" className="mr-2" size={20} />
              Добавить личность
            </>
          )}
        </Button>
      </form>
    </Card>

    <Card className="p-6 md:p-8 neon-border bg-card/80 backdrop-blur-sm">
      <div className="flex items-center gap-3 mb-6">
        <Icon name="Users" className="text-secondary" size={32} />
        <h2 className="text-2xl md:text-3xl font-orbitron font-bold neon-cyan-glow text-secondary">
          Управление личностями
        </h2>
      </div>

      {loadingProfiles ? (
        <div className="flex justify-center py-8">
          <Icon name="Loader2" className="animate-spin text-primary" size={32} />
        </div>
      ) : profiles.length === 0 ? (
        <p className="text-center text-muted-foreground py-8 font-roboto">
          Нет добавленных личностей
        </p>
      ) : (
        <div className="space-y-3">
          {profiles.map((profile) => (
            <div
              key={profile.id}
              className="flex items-center justify-between p-4 rounded-lg bg-muted/50 neon-border hover:bg-muted/70 transition-colors"
            >
              <div className="flex-1">
                <h3 className="font-orbitron font-bold text-foreground mb-1">
                  {profile.name}
                </h3>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-muted-foreground font-roboto">
                    {profile.caste}
                  </span>
                  {profile.username && (
                    <span className="text-secondary neon-cyan-glow">
                      {profile.username}
                    </span>
                  )}
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Icon name="Eye" size={14} />
                    {profile.views}
                  </span>
                </div>
              </div>
              <Button
                onClick={() => handleDelete(profile.id)}
                variant="destructive"
                size="sm"
                className="neon-border"
              >
                <Icon name="Trash2" size={16} />
              </Button>
            </div>
          ))}
        </div>
      )}
    </Card>
  </div>
  );
};

export default AdminPanel;