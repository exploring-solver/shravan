import tkinter as tk
from tkinter import ttk, filedialog, messagebox, simpledialog
import json
import os
from pathlib import Path
from typing import Dict, Any, List
from . import config

class ConfigGUI:
    def __init__(self):
        self.config_data = config.load_app_configs()
        
        # Create the main window
        self.root = tk.Tk()
        self.root.title("shravan Configuration")
        self.root.geometry("800x600")

        # Create notebook for tabs
        self.notebook = ttk.Notebook(self.root)
        self.notebook.pack(expand=True, fill='both', padx=10, pady=5)

        # Initialize tabs
        self.init_apps_tab()
        self.init_scripts_tab()
        self.init_settings_tab()

        # Add save button at bottom
        self.save_button = tk.Button(self.root, text="Save Configuration", command=self.save_config)
        self.save_button.pack(pady=10)

    def init_apps_tab(self):
        """Initialize the Applications tab"""
        self.apps_tab = ttk.Frame(self.notebook)
        self.notebook.add(self.apps_tab, text='Applications')

        # Create canvas and scrollbar
        canvas = tk.Canvas(self.apps_tab)
        scrollbar = ttk.Scrollbar(self.apps_tab, orient="vertical", command=canvas.yview)
        self.scrollable_frame = ttk.Frame(canvas)

        self.scrollable_frame.bind(
            "<Configure>",
            lambda e: canvas.configure(scrollregion=canvas.bbox("all"))
        )

        canvas.create_window((0, 0), window=self.scrollable_frame, anchor="nw")
        canvas.configure(yscrollcommand=scrollbar.set)

        # Platform sections
        self.platform_frames = {}
        for platform in ['windows', 'darwin', 'linux']:
            frame = ttk.LabelFrame(self.scrollable_frame, text=f"{platform.capitalize()} Applications")
            frame.pack(fill='x', padx=5, pady=5)
            self.platform_frames[platform] = frame
            
            # Add new app button for each platform
            ttk.Button(
                frame,
                text="Add New Application",
                command=lambda p=platform: self.add_new_application(p)
            ).pack(pady=5)

            # Load existing applications
            self.load_platform_applications(platform)

        canvas.pack(side="left", fill="both", expand=True)
        scrollbar.pack(side="right", fill="y")

    def init_scripts_tab(self):
        """Initialize the Scripts tab"""
        self.scripts_tab = ttk.Frame(self.notebook)
        self.notebook.add(self.scripts_tab, text='Custom Scripts')

        # Scripts list frame
        list_frame = ttk.LabelFrame(self.scripts_tab, text="Available Scripts")
        list_frame.pack(fill='both', expand=True, padx=5, pady=5)

        # Create treeview for scripts
        columns = ('Name', 'Path')
        self.scripts_tree = ttk.Treeview(list_frame, columns=columns, show='headings')
        for col in columns:
            self.scripts_tree.heading(col, text=col)
            self.scripts_tree.column(col, width=150)

        # Add scrollbar
        scrollbar = ttk.Scrollbar(list_frame, orient="vertical", command=self.scripts_tree.yview)
        self.scripts_tree.configure(yscrollcommand=scrollbar.set)

        self.scripts_tree.pack(side='left', fill='both', expand=True)
        scrollbar.pack(side='right', fill='y')

        # Buttons frame
        button_frame = ttk.Frame(self.scripts_tab)
        button_frame.pack(fill='x', padx=5, pady=5)

        ttk.Button(button_frame, text="Add Script", command=self.add_script).pack(side='left', padx=5)
        ttk.Button(button_frame, text="Edit Script", command=self.edit_script).pack(side='left', padx=5)
        ttk.Button(button_frame, text="Remove Script", command=self.remove_script).pack(side='left', padx=5)

        # Load existing scripts
        self.load_scripts()

    def init_settings_tab(self):
        """Initialize the Settings tab"""
        self.settings_tab = ttk.Frame(self.notebook)
        self.notebook.add(self.settings_tab, text='Settings')

        # Settings frame
        settings_frame = ttk.LabelFrame(self.settings_tab, text="General Settings")
        settings_frame.pack(fill='x', padx=5, pady=5)

        # Token setting
        ttk.Label(settings_frame, text="User Token:").grid(row=0, column=0, padx=5, pady=5)
        self.token_entry = ttk.Entry(settings_frame, width=50)
        self.token_entry.grid(row=0, column=1, padx=5, pady=5)
        
        # Load current token
        current_token = config.load_token()
        if current_token:
            self.token_entry.insert(0, current_token)

    def add_new_application(self, platform: str):
        """Add a new application to a platform"""
        app_name = simpledialog.askstring("New Application", "Enter application name:")
        if app_name:
            path = filedialog.askopenfilename(
                title=f"Select {app_name} executable",
                filetypes=[("Executable files", "*.exe *.app"), ("All files", "*.*")]
            )
            if path:
                if config.add_app_path(platform, app_name, path):
                    self.refresh_platform_applications(platform)
                    messagebox.showinfo("Success", f"Added {app_name} to {platform}")
                else:
                    messagebox.showerror("Error", f"Failed to add {app_name}")

    def load_platform_applications(self, platform: str):
        """Load applications for a specific platform"""
        platform_apps = self.config_data.get(platform, {})
        for app_name, paths in platform_apps.items():
            self.create_app_frame(platform, app_name, paths)

    def create_app_frame(self, platform: str, app_name: str, paths: List[str]):
        """Create a frame for an application with its paths"""
        app_frame = ttk.LabelFrame(self.platform_frames[platform], text=app_name)
        app_frame.pack(fill='x', padx=5, pady=2)

        for path in paths:
            path_frame = ttk.Frame(app_frame)
            path_frame.pack(fill='x', padx=5, pady=2)

            entry = ttk.Entry(path_frame, width=50)
            entry.insert(0, path)
            entry.pack(side='left', padx=5, expand=True)

            ttk.Button(
                path_frame,
                text="Browse",
                command=lambda e=entry: self.browse_path(e)
            ).pack(side='left', padx=2)

            ttk.Button(
                path_frame,
                text="Remove",
                command=lambda p=platform, a=app_name, ph=path: self.remove_path(p, a, ph)
            ).pack(side='left', padx=2)

    def browse_path(self, entry: ttk.Entry):
        """Browse for a file path"""
        path = filedialog.askopenfilename(
            filetypes=[("Executable files", "*.exe *.app"), ("All files", "*.*")]
        )
        if path:
            entry.delete(0, tk.END)
            entry.insert(0, path)

    def remove_path(self, platform: str, app_name: str, path: str):
        """Remove a path from an application"""
        if messagebox.askyesno("Confirm", f"Remove this path from {app_name}?"):
            if config.remove_app_path(platform, app_name, path):
                self.refresh_platform_applications(platform)
                messagebox.showinfo("Success", "Path removed successfully")
            else:
                messagebox.showerror("Error", "Failed to remove path")

    def refresh_platform_applications(self, platform: str):
        """Refresh the display of applications for a platform"""
        # Clear existing widgets
        for widget in self.platform_frames[platform].winfo_children():
            widget.destroy()

        # Add new application button
        ttk.Button(
            self.platform_frames[platform],
            text="Add New Application",
            command=lambda p=platform: self.add_new_application(p)
        ).pack(pady=5)

        # Reload applications
        self.config_data = config.load_app_configs()
        self.load_platform_applications(platform)

    def add_script(self):
        """Add a new custom script"""
        name = simpledialog.askstring("New Script", "Enter script name:")
        if name:
            path = filedialog.askopenfilename(
                title="Select Script File",
                filetypes=[("Python files", "*.py"), ("All files", "*.*")]
            )
            if path:
                if config.add_custom_script(name, path):
                    self.load_scripts()
                    messagebox.showinfo("Success", f"Added script: {name}")
                else:
                    messagebox.showerror("Error", f"Failed to add script: {name}")

    def edit_script(self):
        """Edit an existing custom script"""
        selection = self.scripts_tree.selection()
        if not selection:
            messagebox.showwarning("Warning", "Please select a script to edit")
            return

        item = self.scripts_tree.item(selection[0])
        name = item['values'][0]
        
        path = filedialog.askopenfilename(
            title="Select New Script File",
            filetypes=[("Python files", "*.py"), ("All files", "*.*")]
        )
        if path:
            if config.update_custom_script(name, path):
                self.load_scripts()
                messagebox.showinfo("Success", f"Updated script: {name}")
            else:
                messagebox.showerror("Error", f"Failed to update script: {name}")

    def remove_script(self):
        """Remove a custom script"""
        selection = self.scripts_tree.selection()
        if not selection:
            messagebox.showwarning("Warning", "Please select a script to remove")
            return

        item = self.scripts_tree.item(selection[0])
        name = item['values'][0]

        if messagebox.askyesno("Confirm", f"Remove script: {name}?"):
            if config.remove_custom_script(name):
                self.load_scripts()
                messagebox.showinfo("Success", f"Removed script: {name}")
            else:
                messagebox.showerror("Error", f"Failed to remove script: {name}")

    def load_scripts(self):
        """Load custom scripts into the treeview"""
        # Clear existing items
        for item in self.scripts_tree.get_children():
            self.scripts_tree.delete(item)

        # Load scripts from config
        scripts = config.get_custom_scripts()
        for name, path in scripts.items():
            self.scripts_tree.insert('', 'end', values=(name, path))

    def save_config(self):
        """Save all configuration changes"""
        try:
            # Save token if changed
            new_token = self.token_entry.get().strip()
            if new_token:
                config.save_token(new_token)

            # Configuration is saved automatically for other operations
            messagebox.showinfo("Success", "Configuration saved successfully!")
        except Exception as e:
            messagebox.showerror("Error", f"Failed to save configuration: {str(e)}")

    def run(self):
        """Start the GUI application"""
        self.root.mainloop()

def run_gui():
    """Main entry point for the GUI application"""
    try:
        gui = ConfigGUI()
        gui.run()
    except Exception as e:
        messagebox.showerror("Error", f"Application error: {str(e)}")
        raise

if __name__ == "__main__":
    run_gui()