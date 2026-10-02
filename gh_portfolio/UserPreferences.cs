using System;
using System.Xml.Serialization;

namespace FilmMgr.Config
{
    /// <summary>
    /// User preferences for optical coating calculation session.
    /// Stores substrate default, wavelength grid and optimizer flags.
    /// </summary>
    public class UserPreferences
    {
        /// <summary>Default substrate material code (Si, CaF2, ZnSe...).</summary>
        [XmlElement("Substrate")]
        public string Substrate { get; set; } = "Si";

        /// <summary>Wavelength range in micrometers [min, max].</summary>
        [XmlElement("WavelengthRangeUm")]
        public double[] WavelengthRangeUm { get; set; } = { 2.0, 20.0 };

        /// <summary>Max number of spectrum points (≤100).</summary>
        [XmlElement("MaxPoints")]
        public int MaxPoints { get; set; } = 100;

        /// <summary>Use Powell quadratic refinement after random search.</summary>
        [XmlElement("UsePowell")]
        public bool UsePowell { get; set; } = true;
    }
}
