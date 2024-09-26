import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

const TabbedContainerWithForm = () => {
  return (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle>Tabbed Container</CardTitle>
        <CardDescription>A container with two tabs: form and text area</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="tab1">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="tab1">Form</TabsTrigger>
            <TabsTrigger value="tab2">Text Area</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Enter your name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="Enter your email" />
              </div>
              <Button type="submit">Submit</Button>
            </form>
          </TabsContent>
          <TabsContent value="tab2">
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Type your message here"
                className="min-h-[100px]"
              />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TabbedContainerWithForm;