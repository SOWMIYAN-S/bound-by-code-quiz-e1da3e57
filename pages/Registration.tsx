
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { useUser } from '@/context/UserContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

const Registration = () => {
  const { user, setUser, addUser } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    phone: ''
  });

  useEffect(() => {
    // If user is already logged in, redirect to quiz
    if (user) {
      navigate('/quiz');
    }
  }, [user, navigate]);

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      name: '',
      email: '',
      phone: ''
    };
    
    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email format';
      isValid = false;
    }
    
    // Phone validation
    const phoneRegex = /^\d{10}$/;
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
      isValid = false;
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = 'Phone must be 10 digits';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const newUser = {
        id: uuidv4(),
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        score: 0,
        completed: false
      };
      
      setUser(newUser);
      addUser(newUser);
      
      toast({
        title: "Registration successful!",
        description: "You can now start the quiz.",
        duration: 3000,
      });
      
      navigate('/quiz');
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
        <Card className="w-full max-w-md shadow-lg border-violet-100">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center text-violet-700">Registration</CardTitle>
            <CardDescription className="text-center">
              Enter your details to start the Code Quest
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="10-digit number"
                  value={formData.phone}
                  onChange={handleChange}
                  className={errors.phone ? "border-red-500" : ""}
                />
                {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
              </div>
            </CardContent>
            
            <CardFooter>
              <Button 
                type="submit" 
                className="w-full bg-violet-700 hover:bg-violet-800"
              >
                Start Quiz
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Registration;
