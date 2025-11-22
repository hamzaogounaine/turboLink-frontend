"use client"
import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileCard from "@/components/settingsPage/profileCard";
import { BellRing, Lock, Paintbrush2Icon, User } from "lucide-react";
import ProfileTab from "@/components/settingsPage/profileTab";
import { useAuth } from "@/context/userContext";
import PrivacyTab from '../settingsPage/privacyTab';
import { Separator } from '../ui/separator';

const SettingsComponent = () => {
    const {user} = useAuth()

    return (
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account and preferences
          </p>
        </div>
        <Separator className={'my-7 w-screen'}/>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 ">
          <div className="profileCard md:col-span-1">
            <ProfileCard user={user}/>
          </div>
          <div className="md:col-span-3 ">
            <Tabs defaultValue="profile" className="">
              <TabsList className={"w-full"}>
                {[
                  { id: "profile", label: "Profile", icon: <User /> },
                  { id: "privacy", label: "Privacy & Security", icon: <Lock /> },
                  {
                    id: "notifications",
                    label: "Notifications",
                    icon: <BellRing />,
                  },
                  {
                    id: "appearance",
                    label: "Appearance",
                    icon: <Paintbrush2Icon />,
                  },
                ].map((tab, i) => (
                  <TabsTrigger
                    key={i}
                    value={tab.id}
                    className={"flex justify-center gap-2"}
                  >
                    {tab.icon}
                    <span className="max-md:hidden">{tab.label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
              <TabsContent value="profile" className={'p-2'}>
                <ProfileTab user={user}/>
              </TabsContent>
              <TabsContent value="privacy" className={'p-2'}>
                {user.is_google_user ? <div>You dont have the</div>  : <PrivacyTab user={user} />}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    );
}

export default SettingsComponent
