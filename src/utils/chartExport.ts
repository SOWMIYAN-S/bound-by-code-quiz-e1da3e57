const verifyCertificate = async () => {
  // ... existing validation ...

  setLoading(true);
  try {
    const verification = await verifyCertificate(certificateId);
    
    if (!verification.isValid) {
      toast({
        title: verification.error || 'Error',
        description: verification.errorDetails || 'Verification failed',
        variant: 'destructive',
      });
      setResult({ isValid: false });
      return;
    }

    setResult({
      isValid: true,
      name: verification.name,
      email: verification.email,
      score: verification.score,
      percentage: verification.percentage,
      date: verification.date,
      registerNumber: verification.registerNumber,
      studentClass: verification.studentClass
    });

    toast({
      title: 'Certificate Verified',
      description: 'This certificate is valid and authentic.',
    });
  } catch (error) {
    // ... error handling ...
  } finally {
    setLoading(false);
  }
};
